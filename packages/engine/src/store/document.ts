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

export interface StoreList<T = StoreDocument> extends Array<T> {
  nextOffset?: StoreListOffset | null;
}

export type StoreSelect = Record<string, boolean>;
