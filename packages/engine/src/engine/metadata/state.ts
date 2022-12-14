import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import {
  MetadataGhostState,
  MetadataGhostStateField,
  MetadataGhostStateRelation,
} from '@/metadata';

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
  name: string;
  stateHashes: Buffer[];
  index: number;
}

export const fromStoreMetadataState = (
  getState: (hash: Buffer) => MetadataGhostState,
  getType: (key: string) => MetadataGhostStateField['type'],
  doc: StoreMetadataState,
): MetadataGhostState => {
  if (doc.v !== StoreMetadataStateVersion.V0) {
    throw new NeuledgeError(
      NeuledgeErrorCode.UNSUPPORTED_METADATA,
      `Unsupported metadata version: ${doc.v}`,
    );
  }

  return getState(doc.hash).assign({
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
  state: MetadataGhostState,
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
  getType: (key: string) => MetadataGhostStateField['type'],
  doc: StoreMetadataStateField,
): MetadataGhostStateField => ({
  name: doc.name,
  type: getType(doc.type),
  indexes: doc.indexes,
  nullable: doc.nullable,
});

const toStoreMetadataStateField = (
  field: MetadataGhostStateField,
): StoreMetadataStateField => ({
  name: field.name,
  type: field.type.name,
  indexes: [...field.indexes],
  nullable: field.nullable,
});

const fromStoreMetadataStateRelation = (
  getState: (hash: Buffer) => MetadataGhostState,
  relation: StoreMetadataStateRelation,
): MetadataGhostStateRelation => ({
  name: relation.name,
  states: relation.stateHashes.map((hash) => getState(hash)),
  index: relation.index,
});

const toStoreMetadataStateRelation = (
  relation: MetadataGhostStateRelation,
): StoreMetadataStateRelation => ({
  name: relation.name,
  stateHashes: relation.states.map((state) => state.hash),
  index: relation.index,
});
