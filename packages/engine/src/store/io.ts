import { StoreCollectionName, StoreField, StoreIndex } from './collection.js';
import { StoreListOffset, StoreSelect } from './document.js';
import { StoreFilterOptions, StoreIncludeOptions } from './relation.js';
import { StoreSort } from './sort.js';
import { StoreWhere } from './where.js';

export interface StoreDescribeCollectionOptions {
  collectionName: StoreCollectionName;
}

export interface StoreEnsureCollectionOptions {
  collectionName: StoreCollectionName;
  indexes?: StoreIndex[];
  fields?: StoreField[];
  dropIndexes?: string[];
  dropFields?: string[];
}

export interface StoreDropCollectionOptions {
  collectionName: StoreCollectionName;
}

export interface StoreFindOptions {
  collectionName: StoreCollectionName;
  select?: StoreSelect;
  where?: StoreWhere;
  filter?: StoreFilterOptions['filter'];
  requireFirst?: StoreIncludeOptions['requireFirst'];
  includeFirst?: StoreIncludeOptions['includeFirst'];
  limit: number;
  offset?: StoreListOffset;
  sort?: StoreSort;
}

export interface StoreInsertOptions<T> {
  collectionName: StoreCollectionName;
  documents: T[];
}

export interface StoreUpdateOptions<T> {
  collectionName: StoreCollectionName;
  where?: StoreWhere;
  set: T;
  limit: number;
}

export interface StoreDeleteOptions {
  collectionName: StoreCollectionName;
  where?: StoreWhere;
  limit: number;
}

export interface StoreMutationResponse {
  affectedCount: number;
}
