import { NeuledgeError } from '@/error';
import { MetadataChange, StateSnapshot, METADATA_HASH_BYTES } from '@/metadata';
import { MetadataSnapshot } from '@/metadata/snapshot';
import {
  Store,
  StoreCollection,
  StoreField,
  StoreList,
  StorePrimaryKey,
} from '@neuledge/store';
import pLimit from 'p-limit';
import {
  fromStoreMetadataState,
  StoreMetadataState,
  toStoreMetadataState,
} from './state';

const HASH_ENCODING = 'base64url';
const COLLECTION_FIND_LIMIT = 1000;

export const getMetadataCollection = (
  metadataCollectionName: string,
): StoreCollection => {
  const hash: StoreField = {
    name: 'hash',
    type: 'binary',
    size: METADATA_HASH_BYTES,
  };

  const primaryKey: StorePrimaryKey = {
    name: 'hash',
    fields: { [hash.name]: { sort: 'asc' } },
    unique: 'primary',
  };

  return {
    name: metadataCollectionName,
    primaryKey,
    indexes: { [primaryKey.name]: primaryKey },
    fields: {
      [hash.name]: hash,
      key: { name: 'key', type: 'string' },
      payload: { name: 'payload', type: 'json' },
    },
  };
};

export const ensureMetadataCollection = async (
  store: Store,
  metadataCollection: StoreCollection,
): Promise<void> => {
  await store.ensureCollection({
    collection: metadataCollection,
    indexes: Object.values(metadataCollection.indexes),
    fields: Object.values(metadataCollection.fields),
  });
};

export const getStoreMetadataSnapshot = async (
  snapshot: MetadataSnapshot,
  store: Store,
  metadataCollection: StoreCollection,
): Promise<MetadataSnapshot> => {
  const entities: Record<string, StateSnapshot> = {};

  const getState = (hash: Buffer) => {
    const key = hash.toString(HASH_ENCODING);

    let res = entities[key] as StateSnapshot | undefined;
    if (!res) {
      res = new StateSnapshot() as never;
      entities[key] = res;
    }

    return res;
  };

  const getType = (key: string) => {
    const type = snapshot.findType(key);
    if (!type) {
      throw new NeuledgeError(
        NeuledgeError.Code.CORRUPTED_METADATA,
        `Can't find reference for type: ${key}`,
      );
    }

    return type;
  };

  let res: StoreList | undefined;
  do {
    res = await store.find({
      collection: metadataCollection,
      limit: COLLECTION_FIND_LIMIT,
      offset: res?.nextOffset,
    });

    for (const doc of res) {
      if (!(doc.hash instanceof Buffer)) {
        throw new NeuledgeError(
          NeuledgeError.Code.CORRUPTED_METADATA,
          `Invalid state document: ${doc.hash}`,
        );
      }

      const state = doc as unknown as StoreMetadataState;

      entities[state.hash.toString(HASH_ENCODING)] = fromStoreMetadataState(
        getState,
        getType,
        state,
      );
    }
  } while (res.length >= COLLECTION_FIND_LIMIT);

  return new MetadataSnapshot(Object.values(entities));
};

export const syncStoreMetadata = async (
  store: Store,
  metadataCollection: StoreCollection,
  changes: MetadataChange[],
): Promise<void> => {
  const { inserts, updates } = getStoreMetadataChanges(changes);

  if (inserts.length > 0) {
    await store.insert({
      collection: metadataCollection,
      documents: inserts as never[],
    });
  }

  if (updates.length > 0) {
    const limit = pLimit(10);

    await Promise.all(
      updates.map(({ hash, ...set }) =>
        limit(() =>
          store.update({
            collection: metadataCollection,
            where: { hash: { $eq: hash } },
            set: set as never,
          }),
        ),
      ),
    );
  }
};

const getStoreMetadataChanges = (changes: MetadataChange[]) => {
  const inserts: StoreMetadataState[] = [];
  const updates: StoreMetadataState[] = [];

  for (const change of changes) {
    switch (change.type) {
      case 'created': {
        inserts.push(toStoreMetadataState(change.entity));
        break;
      }

      case 'updated': {
        updates.push(toStoreMetadataState(change.entity));
        break;
      }

      default: {
        throw new NeuledgeError(
          NeuledgeError.Code.METADATA_SAVE_ERROR,
          // @ts-expect-error change type is `never`
          `Unknown metadata change type: ${change.type}`,
        );
      }
    }
  }

  return { inserts, updates };
};
