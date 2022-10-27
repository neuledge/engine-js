import { StoreList } from './document.js';
import {
  StoreCreateOptions,
  StoreDeleteOptions,
  StoreFindOptions,
  StoreMutationResponse,
  StoreUpdateOptions,
} from './io.js';

export interface Store {
  readonly status: StoreStatus;

  connect(): Promise<void>;
  close(): Promise<void>;

  find(options: StoreFindOptions): Promise<StoreList>;

  create(items: StoreCreateOptions): Promise<StoreMutationResponse>;
  update(options: StoreUpdateOptions): Promise<StoreMutationResponse>;
  delete(options: StoreDeleteOptions): Promise<StoreMutationResponse>;
}

export enum StoreStatus {
  DISCONNECTED = 1,
  CONNECTING = 2,
  CONNECTED = 3,
  DISCONNECTING = 4,
}
