import { Client, Pool, PoolConfig } from 'pg';
import {
  dataTypeMap,
  listTableColumns,
  listIndexAttributes,
  listTables,
  dropIndex,
  addIndex,
  createTableIfNotExists,
  addColumn,
} from './queries';
import {
  Store,
  StoreCollection,
  StoreCollection_Slim,
  StoreDeleteOptions,
  StoreDescribeCollectionOptions,
  StoreDocument,
  StoreDropCollectionOptions,
  StoreEnsureCollectionOptions,
  StoreFindOptions,
  StoreInsertOptions,
  StoreInsertionResponse,
  StoreList,
  StoreMutationResponse,
  StoreUpdateOptions,
} from '@neuledge/store';
import {
  dropCollection,
  describeCollection,
  listCollections,
  ensureCollection,
  SQLConnection,
} from '@neuledge/sql-store';

export type PostgreSQLStoreClient = Client | Pool;

export type PostgreSQLStoreOptions =
  | PoolConfig
  | {
      client: PostgreSQLStoreClient;
    };

export class PostgreSQLStore implements Store {
  private client: PostgreSQLStoreClient;
  private connection: SQLConnection;

  constructor(options: PostgreSQLStoreOptions) {
    this.client = 'client' in options ? options.client : new Pool(options);

    this.connection = {
      query: (sql, values) =>
        this.client.query(sql, values).then((result) => result.rows as never),
    };
  }

  // connection methods

  async close(): Promise<void> {
    await this.client.end();
  }

  // store methods

  async listCollections(): Promise<StoreCollection_Slim[]> {
    return listCollections(this.connection, { listTables });
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    return describeCollection(options, this.connection, {
      listTableColumns,
      listIndexAttributes,
      dataTypeMap,
    });
  }

  async ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    return ensureCollection(options, this.connection, {
      createTableIfNotExists,
      addIndex,
      addColumn,
      dropIndex,
      listTableColumns,
      listIndexAttributes,
      dataTypeMap,
    });
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    return dropCollection(options, this.connection);
  }

  async find(options: StoreFindOptions): Promise<StoreList<StoreDocument>> {
    throw new Error('Method not implemented.');
  }

  async insert(options: StoreInsertOptions): Promise<StoreInsertionResponse> {
    throw new Error('Method not implemented.');
  }

  async update(options: StoreUpdateOptions): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }

  async delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }
}
