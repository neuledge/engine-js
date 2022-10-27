import { StoreDocument, StoreListOffset, StoreSelect } from './document.js';
import {
  StoreCollectionName,
  StoreFilterOptions,
  StoreIncludeOptions,
} from './relation.js';
import { StoreSort } from './sort.js';
import { StoreWhere } from './where.js';

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

export interface StoreCreateOptions {
  collectionName: StoreCollectionName;
  create: StoreDocument[];
}

export interface StoreUpdateOptions {
  collectionName: StoreCollectionName;
  where?: StoreWhere;
  set: StoreDocument;
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
