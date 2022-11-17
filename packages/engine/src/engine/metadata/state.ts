import {
  MetadataState,
  MetadataStateField,
  MetadataStateRelation,
} from '@/metadata/index.js';

export interface StoreMetadataState {
  collectionName: string;
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
  nullable: boolean;
}

interface StoreMetadataStateRelation {
  stateHashes: Buffer[];
  index: number;
}

export const fromStoreMetadataState = (
  getState: (hash: Buffer) => MetadataState,
  getType: (key: string) => MetadataStateField['type'],
  doc: StoreMetadataState,
): MetadataState => {
  if (doc.v !== StoreMetadataStateVersion.V0) {
    throw new Error(`Unsupported metadata version: ${doc.v}`);
  }

  return Object.assign(getState(doc.hash) as object, {
    collectionName: doc.collectionName,
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
  state: MetadataState,
): StoreMetadataState => ({
  collectionName: state.collectionName,
  name: state.name,
  hash: state.hash,
  fields: state.fields.map((field) => toStoreMetadataStateField(field)),
  relations: state.relations.map((relation) =>
    toStoreMetadataStateRelation(relation),
  ),
  v: StoreMetadataStateVersion.V0,
});

const fromStoreMetadataStateField = (
  getType: (key: string) => MetadataStateField['type'],
  doc: StoreMetadataStateField,
): MetadataStateField => ({
  name: doc.name,
  type: getType(doc.type),
  indexes: doc.indexes,
  nullable: doc.nullable,
});

const toStoreMetadataStateField = (
  field: MetadataStateField,
): StoreMetadataStateField => ({
  name: field.name,
  type: field.type.key,
  indexes: [...field.indexes],
  nullable: field.nullable,
});

const fromStoreMetadataStateRelation = (
  getState: (hash: Buffer) => MetadataState,
  relation: StoreMetadataStateRelation,
): MetadataStateRelation => ({
  states: relation.stateHashes.map((hash) => getState(hash)),
  index: relation.index,
});

const toStoreMetadataStateRelation = (
  relation: MetadataStateRelation,
): StoreMetadataStateRelation => ({
  stateHashes: relation.states.map((state) => state.hash),
  index: relation.index,
});
