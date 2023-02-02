import {
  StoreCollection_Slim,
  StoreCollection,
  StoreField,
  StoreIndex,
} from './collection';
import {
  StoreDocument,
  StoreList,
  StoreListOffset,
  StoreSelect,
} from './document';
import { StoreIncludeFirst, StoreIncludeMany, StoreMatch } from './relation';
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
    options: StoreInsertOptions<T>,
  ): Promise<StoreInsertionResponse<T>>;

  update<T = StoreDocument>(
    options: StoreUpdateOptions<T>,
  ): Promise<StoreMutationResponse>;

  delete(options: StoreDeleteOptions): Promise<StoreMutationResponse>;
}

export interface StoreDescribeCollectionOptions {
  collection: StoreCollection;
}

export interface StoreEnsureCollectionOptions {
  collection: StoreCollection;
  indexes?: StoreIndex[] | null;
  fields?: StoreField[] | null;
  dropIndexes?: string[] | null;
  dropFields?: string[] | null;
}

export interface StoreDropCollectionOptions {
  collection: StoreCollection;
}

export interface StoreFindOptions {
  collection: StoreCollection;
  select?: StoreSelect | null;
  where?: StoreWhere | null;
  match?: StoreMatch | null;
  requireFirst?: StoreIncludeFirst | null;
  includeFirst?: StoreIncludeFirst | null;
  includeMany?: StoreIncludeMany | null;
  limit: number;
  offset?: StoreListOffset | null;
  sort?: StoreSort | null;
}

export interface StoreInsertOptions<T> {
  collection: StoreCollection;
  documents: T[];
}

export interface StoreUpdateOptions<T> {
  collection: StoreCollection;
  where?: StoreWhere | null;
  match?: StoreMatch | null;
  set: T;
  limit: number;
}

export interface StoreDeleteOptions {
  collection: StoreCollection;
  where?: StoreWhere | null;
  match?: StoreMatch | null;
  limit: number;
}

export interface StoreInsertionResponse<T> extends StoreMutationResponse {
  insertedIds: Partial<T>[];
}

export interface StoreMutationResponse {
  affectedCount: number;
}
