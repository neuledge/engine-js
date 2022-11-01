import { StoreCollectionName } from './collection.js';
import { StoreListOffset, StoreSelect } from './document.js';
import { StoreWhere } from './where.js';

export interface StoreFilterOptions {
  collectionName: StoreCollectionName;
  relation: StoreRelation;
  select?: StoreSelect;
  where?: StoreWhere;
  filter?: Record<FieldName, StoreFilterOptions>;
}

export interface StoreIncludeOptions extends StoreFilterOptions {
  requireFirst?: Record<FieldName, StoreIncludeOptions>;
  includeFirst?: Record<FieldName, StoreIncludeOptions>;
  limit: number;
  offset?: StoreListOffset;
}

type FieldName = string;
type StoreRelation = Record<FieldName, FieldName>;
