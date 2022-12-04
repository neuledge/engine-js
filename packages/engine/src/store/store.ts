import {
  StoreCollection_Slim,
  StoreCollection,
  StoreCollectionName,
  StoreField,
  StoreIndex,
} from './collection';
import {
  StoreDocument,
  StoreList,
  StoreListOffset,
  StoreSelect,
} from './document';
import { StoreMatch } from './relation';
import { StoreSort } from './sort';
import { StoreWhere } from './where';

export interface Store {
  listCollections(): Promise<StoreCollection_Slim[]>;
  describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection>;
  ensureCollection(options: StoreEnsureCollectionOptions): Promise<void>;
  dropCollection(options: StoreDropCollectionOptions): Promise<void>;

  find<T = StoreDocument>(options: StoreFindOptions): Promise<StoreList<T>>;

  insert<T = StoreDocument>(
    items: StoreInsertOptions<T>,
  ): Promise<StoreMutationResponse>;
  update<T = StoreDocument>(
    options: StoreUpdateOptions<T>,
  ): Promise<StoreMutationResponse>;
  delete(options: StoreDeleteOptions): Promise<StoreMutationResponse>;
}

export interface StoreDescribeCollectionOptions {
  name: StoreCollectionName;
}

export interface StoreEnsureCollectionOptions {
  name: StoreCollectionName;
  indexes?: StoreIndex[];
  fields?: StoreField[];
  dropIndexes?: string[];
  dropFields?: string[];
}

export interface StoreDropCollectionOptions {
  name: StoreCollectionName;
}

export interface StoreFindOptions {
  collectionName: StoreCollectionName;
  select?: StoreSelect;
  where?: StoreWhere;
  match?: StoreMatch;
  // requireFirst?: StoreRequireFirst;
  // includeFirst?: StoreIncludeFirst;
  // includeMany?: StoreIncludeMany;
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
