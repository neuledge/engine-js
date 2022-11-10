import { StoreCollectionName } from './collection.js';
import { StoreListOffset, StoreScalarValue, StoreSelect } from './document.js';
import { StoreWhere } from './where.js';

export type StoreFilter = NonNullable<StoreFilterOptions['filter']>;

export type StoreIncludeFirst = NonNullable<
  StoreIncludeOptions['includeFirst']
>;

export type StoreRequireFirst = NonNullable<
  StoreIncludeOptions['requireFirst']
>;

interface StoreFilterOptions {
  collectionName: StoreCollectionName;
  by: StoreFilterBy;
  where?: StoreWhere;
  filter?: Record<FieldName, StoreFilterOptions>;
}

interface StoreIncludeOptions extends StoreFilterOptions {
  select?: StoreSelect;
  requireFirst?: Record<FieldName, StoreIncludeOptions>;
  includeFirst?: Record<FieldName, StoreIncludeOptions>;
  limit: number;
  offset?: StoreListOffset;
}

type FieldName = string;
type StoreFilterBy = Record<
  FieldName,
  FieldName | { $value: StoreScalarValue }
>;
