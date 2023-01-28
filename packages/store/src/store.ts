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
  StoreScalarValue,
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
    options: StoreInsertOptions<T>,
  ): Promise<StoreInsertionResponse>;
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
  indexes?: StoreIndex[];
  fields?: StoreField[];
  dropIndexes?: string[];
  dropFields?: string[];
}

export interface StoreDropCollectionOptions {
  collection: StoreCollection;
}

export interface StoreFindOptions {
  collection: StoreCollection;
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
  collection: StoreCollection;
  documents: T[];
}

export interface StoreUpdateOptions<T> {
  collection: StoreCollection;
  where?: StoreWhere;
  set: T;
  limit: number;
}

export interface StoreDeleteOptions {
  collection: StoreCollection;
  where?: StoreWhere;
  match?: StoreMatch;
  limit: number;
}

export interface StoreInsertionResponse extends StoreMutationResponse {
  insertedIds: StoreScalarValue[];
}

export interface StoreMutationResponse {
  affectedCount: number;
}
