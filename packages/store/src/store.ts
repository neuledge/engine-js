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
import { StoreJoin, StoreMatch } from './relation';
import { StoreSort } from './sort';
import { StoreWhere } from './where';

export interface Store {
  listCollections(): Promise<StoreCollection_Slim[]>;

  describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection>;

  ensureCollection(options: StoreEnsureCollectionOptions): Promise<void>;

  dropCollection(options: StoreDropCollectionOptions): Promise<void>;

  find(options: StoreFindOptions): Promise<StoreList>;

  insert(options: StoreInsertOptions): Promise<StoreInsertionResponse>;

  update(options: StoreUpdateOptions): Promise<StoreMutationResponse>;

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
  innerJoin?: StoreJoin | null;
  leftJoin?: StoreJoin | null;
  limit: number;
  offset?: StoreListOffset | null;
  sort?: StoreSort | null;
}

export interface StoreInsertOptions {
  collection: StoreCollection;
  documents: StoreDocument[];
}

export interface StoreUpdateOptions {
  collection: StoreCollection;
  where?: StoreWhere | null;
  innerJoin?: StoreMatch | null;
  set: StoreDocument;
  limit: number;
}

export interface StoreDeleteOptions {
  collection: StoreCollection;
  where?: StoreWhere | null;
  innerJoin?: StoreMatch | null;
  limit: number;
}

export interface StoreInsertionResponse extends StoreMutationResponse {
  insertedIds: StoreDocument[];
}

export interface StoreMutationResponse {
  affectedCount: number;
}
