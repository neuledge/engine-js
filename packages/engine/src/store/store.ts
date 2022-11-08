import { StoreCollection_Slim, StoreCollection } from './collection.js';
import { StoreDocument, StoreList } from './document.js';
import {
  StoreInsertOptions,
  StoreDeleteOptions,
  StoreFindOptions,
  StoreMutationResponse,
  StoreUpdateOptions,
  StoreDescribeCollectionOptions,
  StoreEnsureCollectionOptions,
  StoreDropCollectionOptions,
} from './io.js';

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
