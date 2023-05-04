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
  StoreIndex,
  StoreIndexField,
  StorePrimaryKey,
  throwStoreError,
} from '@neuledge/store';
import {
  Db,
  DbOptions,
  Document,
  MongoClient,
  MongoClientOptions,
  Collection,
} from 'mongodb';
import pLimit from 'p-limit';
import { escapeDocument, unescapeDocument } from './documents';
import { findFilter } from './filter';
import { dropIndexes, ensureIndexes } from './indexes';
import { applyJoinOptions, JoinQuery } from './join';
import {
  generateDocumentInsertedId,
  AutoIncrementDocument,
} from './inserted-ids';
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
  private readonly collections: Partial<Record<string, Promise<Collection>>>;
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
            .then(
              (client) => client.db(name, db as DbOptions | undefined),
              throwStoreError,
            )
        : Promise.resolve(db as Db);

    this.collections = {};
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
    await this.client.close().catch(throwStoreError);
  }

  async listCollections(): Promise<StoreCollection_Slim[]> {
    const db = await this.db;
    const res = await db
      .listCollections({}, { nameOnly: true })
      .toArray()
      .catch(throwStoreError);

    return res.map((item): StoreCollection_Slim => ({ name: item.name }));
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    const collection = await this.collection(options.collection.name);
    const indexes = await collection
      .listIndexes()
      .toArray()
      .catch(throwStoreError);

    const storeIndexes = indexes.map(
      (index): StoreIndex => ({
        name: index.name,
        fields: Object.fromEntries(
          Object.entries(index.key).map(
            ([key, value]): [string, StoreIndexField] => [
              key,
              { sort: value === 1 ? 'asc' : 'desc' },
            ],
          ),
        ),
        unique:
          index.unique &&
          (index.key._id === 1 && Object.keys(index.key).length === 1
            ? 'primary'
            : true),
      }),
    );

    const primaryKey = storeIndexes.find(
      (index): index is StorePrimaryKey => index.unique === 'primary',
    );
    if (!primaryKey) {
      throw new StoreError(
        StoreError.Code.INTERNAL_ERROR,
        'No primary key found',
      );
    }

    return {
      name: collection.collectionName,
      primaryKey,
      indexes: Object.fromEntries(
        storeIndexes.map((index) => [index.name, index]),
      ),
      fields: (options.collection as StoreCollection).fields ?? {},
    };
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
      await ensureIndexes(
        options.collection.primaryKey,
        collection,
        options.indexes,
      );
    }
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    const db = await this.db;
    await db.dropCollection(options.collection.name).catch(throwStoreError);
  }

  async find(options: StoreFindOptions): Promise<StoreList> {
    const collection = await this.collection(options.collection.name);

    const filter = options.where
      ? findFilter(options.collection.primaryKey, options.where)
      : {};

    let query = collection
      // unicon issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1947
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .find(filter)
      .limit(options.limit);

    if (options.select) {
      query = query.project(
        projectFilter(options.collection.primaryKey, options.select),
      );
    }

    if (options.offset != null) {
      query = query.skip(options.offset as number);
    }

    if (options.sort) {
      query = query.sort(
        sortFilter(options.collection.primaryKey, options.sort),
      );
    }

    const rawDocs = await query.toArray().catch(throwStoreError);
    let docs = rawDocs.map((doc) => unescapeDocument(options.collection, doc));

    const asyncLimit = pLimit(this.readConcurrency);
    docs = await applyJoinOptions(options, docs, (query, signal) =>
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

    const res = await collection
      .insertMany(
        insertedIds.map((insertedId, i) =>
          escapeDocument(options.collection, {
            ...options.documents[i],
            ...insertedId,
          }),
        ),
      )
      .catch(throwStoreError);

    return {
      insertedIds: insertedIds,
      affectedCount: res.insertedCount,
    };
  }

  async update(options: StoreUpdateOptions): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collection.name);

    const filter = options.where
      ? findFilter(options.collection.primaryKey, options.where)
      : {};

    const update = updateFilter(
      options.collection.primaryKey,
      options.set as Document,
    );

    const res = await collection
      .updateMany(filter, update)
      .catch(throwStoreError);

    return {
      affectedCount: res.modifiedCount,
    };
  }

  async delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    const collection = await this.collection(options.collection.name);

    const filter = options.where
      ? findFilter(options.collection.primaryKey, options.where)
      : {};

    const res = await collection.deleteMany(filter).catch(throwStoreError);

    return { affectedCount: res.deletedCount };
  }

  // private helpers

  private collection(collectionName: string): Promise<Collection> {
    let collection = this.collections[collectionName];

    if (!collection) {
      this.collections[collectionName] = collection = this.db.then(
        async (db) => {
          const [exists] = await db
            .listCollections({ name: collectionName }, { nameOnly: true })
            .toArray()
            .catch(throwStoreError);

          if (!exists) {
            // allow retry on next call
            delete this.collections[collectionName];

            throw new StoreError(
              StoreError.Code.COLLECTION_NOT_FOUND,
              `Collection "${collectionName}" not found`,
            );
          }

          return db.collection(collectionName);
        },
      );
    }

    return collection;
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

    const rawDocs = await query.toArray().catch(throwStoreError);

    return rawDocs.map((doc) => unescapeDocument(join.collection, doc));
  }
}
