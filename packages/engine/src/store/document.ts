export type StoreDocument = { [key in string]?: StoreScalarValue };

export type StoreScalarValue =
  | null
  | string
  | number
  | bigint
  | boolean
  | Buffer
  | { [key in string]?: StoreScalarValue }
  | StoreScalarValue[];

export type StoreListOffset = string | number | Buffer;

export interface StoreList<T = StoreDocument> extends Array<T> {
  nextOffset?: StoreListOffset | null;
}

export type StoreSelect = Record<string, boolean>;
