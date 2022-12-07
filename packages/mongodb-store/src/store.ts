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
  Collection,
  CollectionOptions,
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
  private readonly db: Promise<Db>;

  constructor({ url, client, name, db }: MongoDBStoreOptions) {
    this.client =
      typeof url === 'string'
        ? new MongoClient(url, client)
        : (client as MongoClient);

    this.db =
      typeof name === 'string'
        ? this.client
            .connect()
            .then((client) => client.db(name, db as DbOptions | undefined))
        : Promise.resolve(db as Db);

    this.db.catch(() => {
      // catch error to prevent unhandled promise rejection
    });
  }

  async close(): Promise<void> {
    await this.client.close();
  }

  async listCollections(): Promise<StoreCollection_Slim[]> {
    const db = await this.db;
    const res = await db.listCollections({}, { nameOnly: true }).toArray();

    return res.map((item): StoreCollection_Slim => ({ name: item.name }));
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    throw new Error('Method not implemented.');
  }

  async ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    const db = await this.db;
    const collection = await db
      .createCollection(options.name)
      .catch(() => db.collection(options.name));

    if (options.dropIndexes?.length) {
      await Promise.all(
        options.dropIndexes.map((index) => collection.dropIndex(index)),
      );
    }

    if (options.indexes?.length) {
      const exists = await collection.listIndexes().toArray();
      const existMap = new Map(exists.map((item) => [item.name, item]));

      // FIXME handle primary index as an '_id' field

      for (const index of options.indexes) {
        if (existMap.has(index.name)) continue;

        const indexSpec: Record<string, 1 | -1> = {};
        for (const field of index.fields) {
          indexSpec[field.name] = field.order === 'asc' ? 1 : -1;
        }

        await collection.createIndex(indexSpec, {
          name: index.name,
          unique: index.unique || index.primary,
          background: true,
        });
      }
    }
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    const db = await this.db;
    await db.dropCollection(options.name);
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
    const collection = await this.collection(options.collectionName);

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

  // private helpers

  private async collection(
    collectionName: string,
    options?: CollectionOptions,
  ): Promise<Collection> {
    const db = await this.db;
    return db.collection(collectionName, options);
  }

  private where(where: StoreWhere): Filter<Document> {
    throw new Error('Method not implemented.');
  }
}
