import { StoreCollection, StoreField, StorePrimaryKey } from '@neuledge/store';
import { NeuledgeError } from '@/error';
import {
  StateSnapshot,
  StateFieldSnapshot,
  StateRelationSnapshot,
  METADATA_HASH_BYTES,
} from '@/metadata';

export interface StoreMetadataState {
  collection_name: string;
  name: string;
  hash: Buffer;
  fields: StoreMetadataStateField[];
  relations: StoreMetadataStateRelation[];
  v: StoreMetadataStateVersion;
}

export enum StoreMetadataStateVersion {
  V0 = 0,
}

interface StoreMetadataStateField {
  name: string;
  type: string;
  indexes: number[];
  list: boolean;
  nullable: boolean;
}

interface StoreMetadataStateRelation {
  name: string;
  stateHashes: Buffer[];
  index: number;
}

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
      collection_name: { name: 'collection_name', type: 'string' },
      name: { name: 'name', type: 'string' },
      fields: { name: 'fields', type: 'json', list: true },
      relations: { name: 'relations', type: 'json', list: true },
      v: { name: 'v', type: 'number', unsigned: true, scale: 0, precision: 4 },
    },
  };
};

export const fromStoreMetadataState = (
  getState: (hash: Buffer) => StateSnapshot,
  getType: (key: string) => StateFieldSnapshot['type'],
  doc: StoreMetadataState,
): StateSnapshot => {
  if (doc.v !== StoreMetadataStateVersion.V0) {
    throw new NeuledgeError(
      NeuledgeError.Code.UNSUPPORTED_METADATA,
      `Unsupported metadata version: ${doc.v}`,
    );
  }

  return getState(doc.hash).assign({
    collectionName: doc.collection_name,
    name: doc.name,
    hash: doc.hash,
    fields: doc.fields.map((field) =>
      fromStoreMetadataStateField(getType, field),
    ),
    relations: doc.relations.map((relation) =>
      fromStoreMetadataStateRelation(getState, relation),
    ),
  });
};

export const toStoreMetadataState = (
  state: StateSnapshot,
): StoreMetadataState => ({
  collection_name: state.collectionName,
  name: state.name,
  hash: state.hash,
  fields: state.fields.map((field) => toStoreMetadataStateField(field)),
  relations: state.relations.map((relation) =>
    toStoreMetadataStateRelation(relation),
  ),
  v: StoreMetadataStateVersion.V0,
});

const fromStoreMetadataStateField = (
  getType: (key: string) => StateFieldSnapshot['type'],
  doc: StoreMetadataStateField,
): StateFieldSnapshot => ({
  name: doc.name,
  type: getType(doc.type),
  indexes: doc.indexes,
  list: doc.list,
  nullable: doc.nullable,
});

const toStoreMetadataStateField = (
  field: StateFieldSnapshot,
): StoreMetadataStateField => ({
  name: field.name,
  type: field.type.name,
  indexes: [...field.indexes],
  list: field.list,
  nullable: field.nullable,
});

const fromStoreMetadataStateRelation = (
  getState: (hash: Buffer) => StateSnapshot,
  relation: StoreMetadataStateRelation,
): StateRelationSnapshot => ({
  name: relation.name,
  states: relation.stateHashes.map((hash) => getState(hash)),
  index: relation.index,
});

const toStoreMetadataStateRelation = (
  relation: StateRelationSnapshot,
): StoreMetadataStateRelation => ({
  name: relation.name,
  stateHashes: relation.states.map((state) => state.hash),
  index: relation.index,
});
