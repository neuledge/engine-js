import { Pool, PoolConfig, createPool } from 'mysql';
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
  dataTypeMap,
  listTableColumns,
  listIndexAttributes,
  listTables,
} from './queries';
import {
  SQLConnection,
  dropCollection,
  getCollection,
  getStoreCollections,
} from '@neuledge/sql-store';

export type MySQLStoreOptions = PoolConfig;

export class MySQLStore implements Store {
  private pool: Pool;
  private connection: SQLConnection;

  constructor(options: MySQLStoreOptions) {
    this.pool = createPool(options);

    this.connection = {
      query: (sql, values) =>
        new Promise((resolve, reject) =>
          this.pool.query(sql, values, (error, results) =>
            error ? reject(error) : resolve(results),
          ),
        ),
    };
  }

  // connection methods

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) =>
      this.pool.end((error) => (error ? reject(error) : resolve())),
    );
  }

  // store methods

  async listCollections(): Promise<StoreCollection_Slim[]> {
    return getStoreCollections(listTables, this.connection);
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    return getCollection(
      options,
      listTableColumns,
      listIndexAttributes,
      dataTypeMap,
      this.connection,
    );
  }

  async ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    throw new Error('Method not implemented.');
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