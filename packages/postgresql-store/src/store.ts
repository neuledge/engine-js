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
  dropColumn,
  dropTableIfExists,
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
} from '@neuledge/sql-store';

export type PostgreSQLStoreClient = Client | Pool;

export type PostgreSQLStoreOptions =
  | PoolConfig
  | {
      client: PostgreSQLStoreClient;
    };

export class PostgreSQLStore implements Store {
  private connection: PostgreSQLStoreClient;

  constructor(options: PostgreSQLStoreOptions) {
    this.connection = 'client' in options ? options.client : new Pool(options);
  }

  // connection methods

  async close(): Promise<void> {
    await this.connection.end();
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
      dropColumn,
      listTableColumns,
      listIndexAttributes,
      dataTypeMap,
    });
  }

  async dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    return dropCollection(options, this.connection, { dropTableIfExists });
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
