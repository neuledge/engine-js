import {
  SQLColumn,
  SQLIndexAttribute,
  SQLIndexColumn,
  SQLTable,
  toStoreCollection_Slim,
  toStoreField,
  toStoreIndex,
} from '@/mappers';
import {
  StoreCollection,
  StoreCollection_Slim,
  StoreDescribeCollectionOptions,
  StoreError,
  StoreShapeType,
} from '@neuledge/store';

export const getStoreCollections = async <
  A extends unknown[],
  T extends SQLTable,
>(
  listTables: (...args: A) => Promise<T[]>,
  ...params: A
): Promise<StoreCollection_Slim[]> => {
  const tables = await listTables(...params);
  return tables.map((table) => toStoreCollection_Slim(table));
};

export const getCollection = async <
  A extends unknown[],
  C extends SQLColumn,
  I extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof C>,
>(
  options: StoreDescribeCollectionOptions,
  listTableColumns: (name: string, ...args: A) => Promise<C[]>,
  listIndexAttributes: (name: string, ...args: A) => Promise<I[]>,
  dataTypeMap: Record<string, StoreShapeType>,
  ...params: A
): Promise<StoreCollection> => {
  const { name } = options.collection;

  const [columns, indexAttributes] = await Promise.all([
    listTableColumns(name, ...params),
    listIndexAttributes(name, ...params),
  ]);

  const columnMap = Object.fromEntries(
    columns.map((column) => [column.column_name, column]),
  );

  const fields = Object.fromEntries(
    columns.map((column) => [
      column.column_name,
      toStoreField(dataTypeMap, column),
    ]),
  );

  const indexColumns = groupIndexColumns(columnMap, indexAttributes);

  let primaryKey: string | undefined;
  const indexes = Object.fromEntries(
    indexColumns.map((columns) => {
      const index = toStoreIndex(columns);
      if (index.unique === 'primary') {
        primaryKey = index.name;
      }

      return [index.name, index];
    }),
  );

  if (!primaryKey) {
    throw new StoreError(
      StoreError.Code.INVALID_DATA,
      `Primary key not found for collection "${name}"`,
    );
  }

  return {
    name,
    primaryKey: indexes[primaryKey] as StoreCollection['primaryKey'],
    indexes,
    fields,
  };
};

const groupIndexColumns = <
  C extends SQLColumn,
  I extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof C>,
>(
  columnMap: Record<string, C>,
  indexAttributes: I[],
): SQLIndexColumn[][] => {
  const groupMap: Record<string, SQLIndexColumn[]> = {};

  for (const statistic of indexAttributes) {
    let group = groupMap[statistic.index_name];
    if (!group) {
      group = [];
      groupMap[statistic.index_name] = group;
    }

    const column = columnMap[statistic.column_name];
    if (!column) {
      throw new StoreError(
        StoreError.Code.INVALID_DATA,
        `Column "${statistic.column_name}" not found for index "${statistic.index_name}"`,
      );
    }

    group.push({ ...column, ...statistic } as never);
  }

  return Object.values(groupMap);
};
