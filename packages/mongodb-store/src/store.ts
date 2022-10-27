import {
  Store,
  StoreDeleteOptions,
  StoreUpdateOptions,
  StoreStatus,
  StoreList,
  StoreMutationResponse,
  StoreCreateOptions,
  StoreFindOptions,
} from '@neuledge/engine';
import { Db, DbOptions, MongoClient, MongoClientOptions } from 'mongodb';

export interface MongoDBStoreClientOptions extends MongoClientOptions {
  url: string;
}

export interface MongoDBStoreDbOptions extends DbOptions {
  name: string;
}

export class MongoDBStore implements Store {
  private readonly client: MongoClient;
  private readonly db: Db;
  private _status: StoreStatus = StoreStatus.DISCONNECTED;

  constructor(
    client: string | MongoDBStoreClientOptions,
    db: string | MongoDBStoreDbOptions,
  );
  constructor(client: MongoClient, db: string | Db | MongoDBStoreDbOptions);
  constructor(
    client: string | MongoClient | MongoDBStoreClientOptions,
    db: string | Db | MongoDBStoreDbOptions,
  ) {
    this.client =
      typeof client === 'string'
        ? new MongoClient(client)
        : 'url' in client
        ? new MongoClient(client.url, client)
        : client;

    this.db =
      typeof db === 'string'
        ? this.client.db(db)
        : 'name' in db
        ? this.client.db(db.name, db)
        : db;
  }

  get status(): StoreStatus {
    return this._status;
  }

  async connect(): Promise<void> {
    const prev = this._status;
    this._status = StoreStatus.CONNECTING;

    try {
      await this.client.connect();
    } catch (error) {
      this._status = prev;
      throw error;
    }

    this._status = StoreStatus.CONNECTED;
  }

  async close(): Promise<void> {
    const prev = this._status;
    this._status = StoreStatus.DISCONNECTING;

    try {
      await this.client.close();
    } catch (error) {
      this._status = prev;
      throw error;
    }

    this._status = StoreStatus.DISCONNECTED;
  }

  async find(options: StoreFindOptions): Promise<StoreList> {
    throw new Error('Not implemented');
  }

  async create(items: StoreCreateOptions): Promise<StoreMutationResponse> {
    throw new Error('Not implemented');
  }

  async update(options: StoreUpdateOptions): Promise<StoreMutationResponse> {
    throw new Error('Not implemented');
  }

  async delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    throw new Error('Not implemented');
  }
}
