import { StoreCollectionName } from './collection.js';
import { StoreListOffset, StoreScalarValue, StoreSelect } from './document.js';
import { StoreWhere } from './where.js';

export type StoreMatch = Record<FieldName, StoreMatchOptions[]>;
export type StoreIncludeFirst = Record<FieldName, StoreIncludeOptions[]>;
export type StoreRequireFirst = Record<FieldName, StoreIncludeOptions[]>;

export interface StoreMatchOptions {
  collectionName: StoreCollectionName;
  by: StoreFilterBy;
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
type StoreFilterBy = Record<
  FieldName,
  FieldName | { $value: StoreScalarValue }
>;
