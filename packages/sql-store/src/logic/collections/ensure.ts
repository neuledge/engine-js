import {
  SQLConnection,
  dropColumn as dropColumnDefault,
  dropIndex as dropIndexDefault,
} from '@/queries';
import pLimit from 'p-limit';
import {
  StoreCollection,
  StoreEnsureCollectionOptions,
  StoreField,
  StoreIndex,
} from '@neuledge/store';
import { SQLColumn, SQLIndexAttribute, SQLIndexColumn } from '@/mappers';
import { DescribeCollectionQueries, describeCollection } from './describe';

export interface EnsureCollectionQueries {
  createTableIfNotExists: (
    collection: StoreCollection,
    connection: SQLConnection,
  ) => Promise<void>;
  addIndex: (
    tableName: string,
    index: StoreIndex,
    connection: SQLConnection,
  ) => Promise<void>;
  addColumn: (
    tableName: string,
    field: StoreField,
    connection: SQLConnection,
  ) => Promise<void>;
  dropIndex?: (
    tableName: string,
    index: string,
    connection: SQLConnection,
  ) => Promise<void>;
  dropColumn?: (
    tableName: string,
    field: string,
    connection: SQLConnection,
  ) => Promise<void>;
}

export const ensureCollection = async <
  C extends SQLColumn,
  I extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof C>,
>(
  options: StoreEnsureCollectionOptions,
  connection: SQLConnection,
  {
    createTableIfNotExists,
    addIndex,
    addColumn,
    dropIndex = dropIndexDefault,
    dropColumn = dropColumnDefault,
    ...describeCollectionQueries
  }: EnsureCollectionQueries & DescribeCollectionQueries<C, I>,
): Promise<void> => {
  await createTableIfNotExists(options.collection, connection);

  const tableName = options.collection.name;
  const asyncLimit = pLimit(4);

  await Promise.all(
    options.dropIndexes?.map((index) =>
      asyncLimit(() => dropIndex(tableName, index, connection)),
    ) || [],
  );

  await Promise.all(
    options.dropFields?.map((field) =>
      asyncLimit(() => dropColumn(tableName, field, connection)),
    ) || [],
  );

  const collection = await describeCollection(
    options,
    connection,
    describeCollectionQueries,
  );

  // although we support adding columns with non-nullables types, it will be
  // rejected by the database and for a good reason. It's the responsibility of
  // the engine to ensure that new columns are nullable if inserted after the
  // collection has been created and this is the current implementation.

  await Promise.all([
    ...(options.indexes
      ?.filter((index) => !collection.indexes[index.name])
      .map((index) =>
        asyncLimit(() => addIndex(tableName, index, connection)),
      ) || []),
    ...(options.fields
      ?.filter((field) => !collection.fields[field.name])
      .map((field) =>
        asyncLimit(() => addColumn(tableName, field, connection)),
      ) || []),
  ]);
};
