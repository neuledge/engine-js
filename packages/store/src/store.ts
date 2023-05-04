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
import { StoreJoin, StoreLeftJoin } from './join';
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
  collection: StoreCollection_Slim | StoreCollection;
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

  /**
   * Select only the specified fields to be returned.
   * If not specified, all fields will be returned.
   */
  select?: StoreSelect | null;

  where?: StoreWhere | null;
  innerJoin?: StoreJoin | null;
  leftJoin?: StoreLeftJoin | null;
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

  /**
   * Set is a document that contains the fields to be updated and their new values.
   * The fields that are not present in the set document will not be updated.
   * `undefined` values will be converted to `null` values.
   */
  set: StoreDocument;
}

export interface StoreDeleteOptions {
  collection: StoreCollection;
  where?: StoreWhere | null;
}

export interface StoreInsertionResponse extends StoreMutationResponse {
  insertedIds: StoreDocument[];
}

export interface StoreMutationResponse {
  affectedCount: number;
}
