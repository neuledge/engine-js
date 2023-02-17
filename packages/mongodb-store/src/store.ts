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
  StoreInsertionResponse,
  StoreError,
} from '@neuledge/store';
import {
  Db,
  DbOptions,
  Document,
  MongoClient,
  MongoClientOptions,
  Collection,
  CollectionOptions,
} from 'mongodb';
import pLimit from 'p-limit';
import { escapeDocument, unescapeDocument } from './documents';
import { findFilter } from './filter';
import { dropIndexes, ensureIndexes } from './indexes';
import { applyJoins, JoinQuery } from './join';
import {
  generateDocumentInsertedId,
  AutoIncrementDocument,
} from './primary-key';
import { projectFilter } from './project';
import { sortFilter } from './sort';
import { updateFilter } from './update';

const AUTO_INCREMENT_COLLECTION_NAME = '__neuledge_auto_increment';
const DEFAULT_READ_CONCURRENCY = 2;
const DEFAULT_WRITE_CONCURRENCY = 2;

export type MongoDBStoreOptions = MongoDBStoreConnectionOptions & {
  autoIncrementCollectionName?: string;
  readConcurrency?: number;
  writeConcurrency?: number;
};

export type MongoDBStoreConnectionOptions =
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
  private readonly autoIncrement: Promise<Collection<AutoIncrementDocument>>;
  private readonly readConcurrency: number;
  private readonly writeConcurrency: number;

  constructor({
    url,
    client,
    name,
    db,
    autoIncrementCollectionName = AUTO_INCREMENT_COLLECTION_NAME,
    readConcurrency = DEFAULT_READ_CONCURRENCY,
    writeConcurrency = DEFAULT_WRITE_CONCURRENCY,
  }: MongoDBStoreOptions) {
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

    this.autoIncrement = this.db.then((db) =>
      db.collection(autoIncrementCollectionName),
    );

    this.readConcurrency = readConcurrency;
    this.writeConcurrency = writeConcurrency;

    Promise.all([this.db, this.autoIncrement]).catch(() => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    // FIXME implement mongodb store describeCollection
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
      .createCollection(options.collection.name)
      .catch(() => db.collection(options.collection.name));

    if (options.dropIndexes?.length) {
      await dropIndexes(collection, options.dropIndexes);
    }

    if (options.indexes?.length) {
      await ensureIndexes(collection, options.indexes);
    }
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    const db = await this.db;
    await db.dropCollection(options.collection.name);
  }

  async find(options: StoreFindOptions): Promise<StoreList> {
    const collection = await this.collection(options.collection.name);

    let query = collection
      // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .find(options.where ? findFilter(options.where) : {})
      .limit(options.limit);

    if (options.select) {
      query = query.project(projectFilter(options.select));
    }

    if (options.offset != null) {
      query = query.skip(options.offset as number);
    }

    if (options.sort) {
      query = query.sort(sortFilter(options.sort));
    }

    const rawDocs = await query.toArray();
    let docs = rawDocs.map((doc) => unescapeDocument(options.collection, doc));

    const asyncLimit = pLimit(this.readConcurrency);
    docs = await applyJoins(options, docs, (query, signal) =>
      asyncLimit(() => this.queryJoin(query, signal)),
    );

    return Object.assign(docs, {
      nextOffset:
        docs.length < options.limit
          ? null
          : ((options.offset ?? 0) as number) + docs.length,
    });
  }

  async insert(options: StoreInsertOptions): Promise<StoreInsertionResponse> {
    const collection = await this.collection(options.collection.name);
    const autoIncrement = await this.autoIncrement;

    const asyncLimit = pLimit(this.writeConcurrency);
    const insertedIds = await Promise.all(
      options.documents.map((doc) =>
        asyncLimit(() =>
          generateDocumentInsertedId(autoIncrement, options.collection, doc),
        ),
      ),
    );

    const res = await collection.insertMany(
      insertedIds.map((insertedId, i) =>
        escapeDocument(options.collection, {
          ...options.documents[i],
          ...insertedId,
        }),
      ),
    );

    return {
      insertedIds: insertedIds,
      affectedCount: res.insertedCount,
    };
  }

  async update(options: StoreUpdateOptions): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collection.name);

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
    const collection = await this.collection(options.collection.name);

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

  private async queryJoin(
    join: JoinQuery,
    signal: AbortSignal,
  ): Promise<StoreDocument[]> {
    if (signal.aborted) {
      throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
    }

    const collection = await this.collection(join.collection.name);

    if (signal.aborted) {
      throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
    }

    // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
    // eslint-disable-next-line unicorn/no-array-callback-reference
    let query = collection.find(join.find).limit(join.limit);

    if (join.project) {
      query = query.project(join.project ?? { _id: 1 });
    }

    const rawDocs = await query.toArray();

    return rawDocs.map((doc) => unescapeDocument(join.collection, doc));
  }
}
