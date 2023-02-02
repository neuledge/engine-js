import { StoreCollection } from './collection';
import { StoreListOffset, StoreScalarValue, StoreSelect } from './document';
import { StoreWhere } from './where';

export type StoreMatch = Record<string, StoreMatchOptions[]>;

export type StoreIncludeFirst = Record<string, StoreIncludeOptions[]>;
export type StoreIncludeMany = Record<string, StoreIncludeManyOptions[]>;

export interface StoreMatchOptions {
  collection: StoreCollection;
  by: StoreMatchBy;
  where?: StoreWhere | null;
  match?: StoreMatch | null;
}

export interface StoreIncludeOptions extends StoreMatchOptions {
  select?: StoreSelect | null;
  requireFirst?: StoreIncludeFirst | null;
  includeFirst?: StoreIncludeFirst | null;
  includeMany?: StoreIncludeMany | null;
  offset?: StoreListOffset | null;
}

export interface StoreIncludeManyOptions extends StoreIncludeOptions {
  limit: number;
}

type FieldName = string;

export type StoreMatchBy = Record<
  FieldName,
  StoreMatchByValue | StoreMatchByField
>;

export type StoreMatchByValue = { value: StoreScalarValue; field?: never };
export type StoreMatchByField = { field: FieldName; value?: never };
