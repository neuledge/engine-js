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
  StoreCollection_Slim,
  StoreCollection,
} from '@neuledge/engine';
import {
  Db,
  DbOptions,
  Document,
  MongoClient,
  MongoClientOptions,
  Collection,
  CollectionOptions,
} from 'mongodb';
import { escapeDocument, unescapeDocument } from './documents';
import { findFilter } from './filter';
import { dropIndexes, ensureIndexes } from './indexes';
import { projectFilter } from './project';
import { sortFilter } from './sort';
import { updateFilter } from './update';

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

    //     const collection = await this.collection(options.name);
    //
    //     const indexes = await collection.indexes();
    //
    //     return {
    //       name: collection.collectionName,
    //       indexes: [],
    //       fields: [],
    //     };
  }

  async ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    const db = await this.db;
    const collection = await db
      .createCollection(options.name)
      .catch(() => db.collection(options.name));

    if (options.dropIndexes?.length) {
      await dropIndexes(collection, options.dropIndexes);
    }

    if (options.indexes?.length) {
      await ensureIndexes(collection, options.indexes);
    }
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    const db = await this.db;
    await db.dropCollection(options.name);
  }

  async find<T = StoreDocument>(
    options: StoreFindOptions,
  ): Promise<StoreList<T>> {
    const collection = await this.collection(options.collectionName);

    let query = collection
      // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .find(options.where ? findFilter(options.where) : {})
      .limit(options.limit);

    if (options.select) {
      query = query.project(projectFilter(options.select));
    }

    // FIXME support `match`

    if (options.offset != null) {
      query = query.skip(options.offset as number);
    }

    if (options.sort) {
      query = query.sort(sortFilter(options.sort));
    }

    const docs = await query.toArray();

    return Object.assign(
      docs.map((doc) => unescapeDocument<T>(doc)),
      {
        nextOffset:
          docs.length < options.limit
            ? null
            : ((options.offset ?? 0) as number) + docs.length,
      },
    );
  }

  async insert<T = StoreDocument>(
    options: StoreInsertOptions<T>,
  ): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collectionName);

    const res = await collection.insertMany(
      options.documents.map((doc) => escapeDocument(doc)),
    );

    return { affectedCount: res.insertedCount };
  }

  async update<T = StoreDocument>(
    options: StoreUpdateOptions<T>,
  ): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collectionName);

    const filter = options.where ? findFilter(options.where) : {};
    const update = updateFilter(options.set as Document);
    let res;

    if (options.limit === 1) {
      res = await collection.updateOne(filter, update);
    } else {
      const ids = await collection
        // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
        // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
        .find(filter, {
          limit: options.limit,
          projection: { _id: 1 },
        })
        .toArray();

      if (!ids.length) {
        return { affectedCount: 0 };
      }

      res = await collection.updateMany(
        { ...filter, _id: { $in: ids.map((id) => id._id) } },
        update,
      );
    }

    return {
      affectedCount: res.modifiedCount,
    };
  }

  async delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collectionName);

    const filter = options.where ? findFilter(options.where) : {};
    let res;

    if (options.limit === 1) {
      res = await collection.deleteOne(filter);
    } else {
      const ids = await collection
        // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
        // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
        .find(filter, {
          limit: options.limit,
          projection: { _id: 1 },
        })
        .toArray();

      if (!ids.length) {
        return { affectedCount: 0 };
      }

      res = await collection.deleteMany({
        ...filter,
        _id: { $in: ids.map((id) => id._id) },
      });
    }

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
}
