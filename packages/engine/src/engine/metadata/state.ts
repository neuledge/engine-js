import { MetadataState, MetadataStateField } from '@/metadata/index.js';

export interface StoreMetadataState {
  collectionName: string;
  key: string;
  hash: Buffer;
  fields: StoreMetadataStateField[];
}

interface StoreMetadataStateField {
  name: string;
  type: string;
  indexes: number[];
  nullable: boolean;
}

export const fromStoreMetadataState = (
  getState: (hash: Buffer) => MetadataState,
  getType: (key: string) => MetadataStateField['type'],
  doc: StoreMetadataState,
): MetadataState =>
  Object.assign(getState(doc.hash), {
    key: doc.key,
    hash: doc.hash,
    fields: doc.fields.map((field) =>
      fromStoreMetadataStateField(getType, field),
    ),
  });

export const toStoreMetadataState = (
  state: MetadataState,
): StoreMetadataState => ({
  collectionName: state.collectionName,
  key: state.key,
  hash: state.hash,
  fields: state.fields.map((field) => toStoreMetadataStateField(field)),
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
