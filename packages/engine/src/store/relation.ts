import { StoreCollectionName } from './collection.js';
import { StoreListOffset, StoreScalarValue, StoreSelect } from './document.js';
import { StoreWhere } from './where.js';

export type StoreMatch = Record<string, StoreMatchOptions[]>;
export type StoreIncludeFirst = Record<string, StoreIncludeOptions[]>;
export type StoreRequireFirst = Record<string, StoreIncludeOptions[]>;

export interface StoreMatchOptions {
  collectionName: StoreCollectionName;
  by: StoreMatchBy;
  where?: StoreWhere;
  match?: StoreMatch;
}

export interface StoreIncludeOptions extends StoreMatchOptions {
  select?: StoreSelect;
  requireFirst?: StoreRequireFirst;
  includeFirst?: StoreIncludeFirst;
  limit: number;
  offset?: StoreListOffset;
}

type FieldName = string;
export type StoreMatchBy = Record<
  FieldName,
  FieldName | { $value: StoreScalarValue }
>;
