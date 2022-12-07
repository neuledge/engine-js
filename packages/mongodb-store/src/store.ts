import {
  Store,
  StoreDeleteOptions,
  StoreUpdateOptions,
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

export type MongoDBStoreOptions =
  | {
      url: string;
      client?: MongoClientOptions;
      name: string;
      db?: DbOptions;
    }
  | {
      url?: never;
      client: MongoClient;
      name: string;
      db?: DbOptions;
    }
  | {
      url?: never;
      client: MongoClient;
      name?: never;
      db: Db;
    };

export class MongoDBStore implements Store {
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor({ url, client, name, db }: MongoDBStoreOptions) {
    this.client =
      typeof url === 'string'
        ? new MongoClient(url, client)
        : (client as MongoClient);

    this.db =
      typeof name === 'string'
        ? this.client.db(name, db as DbOptions | undefined)
        : (db as Db);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async close(): Promise<void> {
    await this.client.close();
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
