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
  type: string;
  index: number;
  nullable: boolean;
  relations: Buffer[];
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
  type: doc.type,
  index: doc.index,
  nullable: doc.nullable,
  relations: doc.relations.map((hash) => getState(hash)),
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
      type: field.type,
      index: field.index,
      nullable: field.nullable,
      relations: field.relations.map((item) => item.hash),
    }),
  ),
});
