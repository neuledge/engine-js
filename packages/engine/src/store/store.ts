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
  readonly status: StoreStatus;

  connect(): Promise<void>;
  close(): Promise<void>;

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

export enum StoreStatus {
  DISCONNECTED = 1,
  CONNECTING = 2,
  CONNECTED = 3,
  DISCONNECTING = 4,
}
