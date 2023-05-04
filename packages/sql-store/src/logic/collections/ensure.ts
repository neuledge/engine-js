import pLimit from 'p-limit';
import {
  StoreCollection,
  StoreEnsureCollectionOptions,
  StoreField,
  StoreIndex,
  throwStoreError,
} from '@neuledge/store';
import { SQLColumn, SQLIndexAttribute, SQLIndexColumn } from '@/mappers';
import { DescribeCollectionQueries, describeCollection } from './describe';

export interface EnsureCollectionQueries<
  Connection,
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
> extends EnsureCollectionQueriesOnly<Connection>,
    DescribeCollectionQueries<Connection, Column, IndexAttribute> {}

export interface EnsureCollectionQueriesOnly<Connection> {
  createTableIfNotExists(
    connection: Connection,
    collection: StoreCollection,
  ): Promise<void>;
  addIndex(
    connection: Connection,
    collection: StoreCollection,
    index: StoreIndex,
  ): Promise<void>;
  addColumn(
    connection: Connection,
    collection: StoreCollection,
    field: StoreField,
  ): Promise<void>;
  dropIndex(
    connection: Connection,
    collection: StoreCollection,
    index: string,
  ): Promise<void>;
  dropColumn(
    connection: Connection,
    collection: StoreCollection,
    field: string,
  ): Promise<void>;
}

export const ensureCollection = async <
  Connection,
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
>(
  options: StoreEnsureCollectionOptions,
  connection: Connection,
  queries: EnsureCollectionQueries<Connection, Column, IndexAttribute>,
): Promise<void> => {
  await queries
    .createTableIfNotExists(connection, options.collection)
    .catch(throwStoreError);

  await dropProperties(options, connection, queries);

  const existsCollection = await describeCollection(
    options,
    connection,
    queries,
  );

  await addProperties(options, connection, existsCollection, queries);
};

const dropProperties = async <Connection>(
  options: StoreEnsureCollectionOptions,
  connection: Connection,
  { dropIndex, dropColumn }: EnsureCollectionQueriesOnly<Connection>,
) => {
  const asyncLimit = pLimit(4);

  await Promise.all(
    options.dropIndexes?.map((index) =>
      asyncLimit(() => dropIndex(connection, options.collection, index)),
    ) || [],
  ).catch(throwStoreError);

  await Promise.all(
    options.dropFields?.map((field) =>
      asyncLimit(() => dropColumn(connection, options.collection, field)),
    ) || [],
  ).catch(throwStoreError);
};

const addProperties = async <Connection>(
  options: StoreEnsureCollectionOptions,
  connection: Connection,
  existsCollection: StoreCollection,
  { addIndex, addColumn }: EnsureCollectionQueriesOnly<Connection>,
) => {
  const asyncLimit = pLimit(4);

  // although we support adding columns with non-nullables types, it will be
  // rejected by the database and for a good reason. It's the responsibility of
  // the engine to ensure that new columns are nullable if inserted after the
  // collection has been created and this is the current implementation.

  await Promise.all(
    options.fields
      ?.filter((field) => !existsCollection.fields[field.name])
      .map((field) =>
        asyncLimit(() => addColumn(connection, existsCollection, field)),
      ) || [],
  ).catch(throwStoreError);

  await Promise.all(
    options.indexes
      ?.filter(
        (index) =>
          !existsCollection.indexes[index.name] && index.unique !== 'primary',
      )
      .map((index) =>
        asyncLimit(() => addIndex(connection, existsCollection, index)),
      ) || [],
  ).catch(throwStoreError);
};
