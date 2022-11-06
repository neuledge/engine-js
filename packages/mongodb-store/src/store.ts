import {
  Store,
  StoreDeleteOptions,
  StoreUpdateOptions,
  StoreStatus,
  StoreList,
  StoreMutationResponse,
  StoreInsertOptions,
  StoreFindOptions,
  StoreDocument,
  StoreDescribeCollectionOptions,
  StoreDropCollectionOptions,
  StoreEnsureCollectionOptions,
  StoreWhere,
  StoreCollection_Slim,
  StoreCollection,
} from '@neuledge/engine';
import {
  Db,
  DbOptions,
  Filter,
  Document,
  MongoClient,
  MongoClientOptions,
} from 'mongodb';

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

  async listCollections(): Promise<StoreCollection_Slim[]> {
    const res = await this.db.listCollections({}, { nameOnly: true }).toArray();

    return res.map((item): StoreCollection_Slim => ({ name: item.name }));
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    throw new Error('Method not implemented.');
  }

  async ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    await this.db.dropCollection(options.name);
  }

  async find<T = StoreDocument>(
    options: StoreFindOptions,
  ): Promise<StoreList<T>> {
    throw new Error('Method not implemented.');
  }

  async insert<T = StoreDocument>(
    items: StoreInsertOptions<T>,
  ): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }

  async update<T = StoreDocument>(
    options: StoreUpdateOptions<T>,
  ): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }

  async delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    const collection = this.db.collection(options.collectionName);

    const ids = await collection
      // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
      // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
      .find(options.where ? this.where(options.where) : {}, {
        limit: options.limit,
        projection: { _id: 1 },
      })
      .toArray();

    if (!ids.length) {
      return { affectedCount: 0 };
    }

    const res = await collection.deleteMany({
      _id: { $in: ids.map((id) => id._id) },
    });

    return { affectedCount: res.deletedCount };
  }

  private where(where: StoreWhere): Filter<Document> {
    throw new Error('Method not implemented.');
  }
}
