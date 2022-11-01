import {
  Metadata,
  MetadataChange,
  MetadataEntity,
  MetadataState,
  METADATA_HASH_BYTES,
} from '@/metadata/index.js';
import { Store, StoreList } from '@/store/index.js';
import pLimit from 'p-limit';
import {
  StoreMetadataEntity,
  toMetadataEntity,
  toStoreMetadataEntity,
} from './entity.js';

const HASH_ENCODING = 'base64url';
const COLLECTION_FIND_LIMIT = 1000;

export const ensureStoreMetadata = async (
  store: Store,
  collectionName: string,
): Promise<void> => {
  await store.ensureCollection({
    collectionName,
    indexes: [
      { name: 'hash', fields: [{ name: 'hash', order: 'asc' }], primary: true },
    ],
    fields: [
      { name: 'hash', type: 'binary', size: METADATA_HASH_BYTES },
      { name: 'key', type: 'string' },
      { name: 'type', type: 'enum', values: ['state', 'either'] },
      { name: 'payload', type: 'json' },
    ],
  });
};

export const getStoreMetadata = async (
  store: Store,
  collectionName: string,
): Promise<Metadata> => {
  const entities: Record<string, MetadataEntity> = {};

  let res: StoreList<StoreMetadataEntity> | undefined;
  do {
    res = await store.find({
      collectionName,
      limit: COLLECTION_FIND_LIMIT,
      offset: res?.nextOffset ?? undefined,
    });

    for (const doc of res) {
      entities[doc.hash.toString(HASH_ENCODING)] = toMetadataEntity((hash) => {
        const key = hash.toString(HASH_ENCODING);

        let res = entities[key] as MetadataState | undefined;
        if (!res) {
          res = {} as never;
          entities[key] = res;
        }

        return res;
      }, doc);
    }
  } while (res.length >= COLLECTION_FIND_LIMIT);

  return new Metadata(Object.values(entities));
};

export const syncStoreMetadata = async (
  store: Store,
  collectionName: string,
  changes: MetadataChange[],
): Promise<void> => {
  const { inserts, updates, deletes } = getStoreMetadataChanges(changes);

  if (inserts.length > 0) {
    await store.insert({ collectionName, documents: inserts });
  }

  if (updates.length > 0) {
    const limit = pLimit(10);

    await Promise.all(
      updates.map(({ hash, ...set }) =>
        limit(() =>
          store.update({
            collectionName,
            where: { hash: { $eq: hash } },
            set,
            limit: 1,
          }),
        ),
      ),
    );
  }

  if (deletes.length > 0) {
    await store.delete({
      collectionName,
      where: { hash: { $in: deletes } },
      limit: deletes.length,
    });
  }
};

const getStoreMetadataChanges = (changes: MetadataChange[]) => {
  const inserts: StoreMetadataEntity[] = [];
  const updates: StoreMetadataEntity[] = [];
  const deletes: Buffer[] = [];

  for (const change of changes) {
    switch (change.type) {
      case 'created': {
        inserts.push(toStoreMetadataEntity(change.entity));
        break;
      }

      case 'renamed':
      case 'updated': {
        updates.push(toStoreMetadataEntity(change.entity));
        break;
      }

      case 'deleted': {
        deletes.push(change.origin.hash);
        break;
      }

      default: {
        // @ts-expect-error change type is `never`
        throw new Error(`Unknown metadata change type: ${change.type}`);
      }
    }
  }

  return { inserts, updates, deletes };
};
