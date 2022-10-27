export type StoreDocument = { [key in string]?: StoreDocumentValue };

export type StoreDocumentValue =
  | null
  | string
  | number
  | bigint
  | boolean
  | Buffer
  | { [key in string]?: StoreDocumentValue };

export type StoreListOffset = string | number | Buffer;

export interface StoreList extends Array<StoreDocument> {
  nextOffset?: StoreListOffset | null;
}

export type StoreSelect = Record<string, boolean>;
