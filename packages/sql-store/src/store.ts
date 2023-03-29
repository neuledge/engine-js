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
  SQLConnection,
  listTableColumns,
  listTableStatistics,
  listTables,
} from './queries';
import {
  toStoreCollection_Slim,
  toStoreField,
  toStoreIndexes,
} from './mappers';

export class SQLStore implements Store {
  constructor(public readonly connection: SQLConnection) {}

  async listCollections(): Promise<StoreCollection_Slim[]> {
    const tables = await listTables(this.connection);
    return tables.map((table) => toStoreCollection_Slim(table));
  }

  async describeCollection(
    options: StoreDescribeCollectionOptions,
  ): Promise<StoreCollection> {
    const { name } = options.collection;

    const [columns, statistics] = await Promise.all([
      listTableColumns(this.connection, name),
      listTableStatistics(this.connection, name),
    ]);

    const fields = columns.map((column) => toStoreField(column));
    const indexes = toStoreIndexes(statistics);

    return {
      name,
      primaryKey: indexes[0],
      indexes: Object.fromEntries(indexes.map((index) => [index.name, index])),
      fields: Object.fromEntries(fields.map((field) => [field.name, field])),
    };
  }

  ensureCollection(options: StoreEnsureCollectionOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  dropCollection(options: StoreDropCollectionOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  find(options: StoreFindOptions): Promise<StoreList<StoreDocument>> {
    throw new Error('Method not implemented.');
  }

  insert(options: StoreInsertOptions): Promise<StoreInsertionResponse> {
    throw new Error('Method not implemented.');
  }

  update(options: StoreUpdateOptions): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }

  delete(options: StoreDeleteOptions): Promise<StoreMutationResponse> {
    throw new Error('Method not implemented.');
  }
}
