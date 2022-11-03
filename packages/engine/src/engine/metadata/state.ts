import { MetadataState, MetadataStateField } from '@/metadata/index.js';

export interface StoreMetadataState {
  collectionName: string;
  key: string;
  hash: Buffer;
  fields: StoreMetadataStateField[];
}

interface StoreMetadataStateField {
  key: string;
  fieldName: string;
  type: string | Buffer[];
  index: number;
  nullable: boolean;
}

export const fromStoreMetadataState = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataState,
): MetadataState =>
  Object.assign(getState(doc.hash), {
    key: doc.key,
    hash: doc.hash,
    fields: Object.fromEntries(
      Object.entries(doc.fields).map(([key, field]) => [
        key,
        fromStoreMetadataStateField(getState, field),
      ]),
    ),
  });

const fromStoreMetadataStateField = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataStateField,
): MetadataStateField => ({
  fieldName: doc.fieldName,
  type: Array.isArray(doc.type)
    ? doc.type.map((item) => getState(item))
    : doc.type,
  index: doc.index,
  nullable: doc.nullable,
});

export const toStoreMetadataState = (
  state: MetadataState,
): StoreMetadataState => ({
  collectionName: state.collectionName,
  key: state.key,
  hash: state.hash,
  fields: Object.entries(state.fields).map(
    ([key, field]): StoreMetadataStateField => ({
      key,
      fieldName: field.fieldName,
      type:
        typeof field.type === 'string'
          ? field.type
          : field.type.map((item) => item.hash),
      index: field.index,
      nullable: field.nullable,
    }),
  ),
});
