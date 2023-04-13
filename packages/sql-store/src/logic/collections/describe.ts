import {
  SQLColumn,
  SQLIndexAttribute,
  SQLIndexColumn,
  toStoreField,
  toStoreIndex,
} from '@/mappers';
import { SQLConnection } from '@/queries';
import {
  StoreCollection,
  StoreDescribeCollectionOptions,
  StoreError,
  StoreShapeType,
} from '@neuledge/store';

export interface DescribeCollectionQueries<
  C extends SQLColumn,
  I extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof C>,
> {
  listTableColumns: (name: string, connection: SQLConnection) => Promise<C[]>;
  listIndexAttributes: (
    name: string,
    connection: SQLConnection,
  ) => Promise<I[]>;
  dataTypeMap: Record<string, StoreShapeType>;
}

export const describeCollection = async <
  C extends SQLColumn,
  I extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof C>,
>(
  options: StoreDescribeCollectionOptions,
  connection: SQLConnection,
  {
    listTableColumns,
    listIndexAttributes,
    dataTypeMap,
  }: DescribeCollectionQueries<C, I>,
): Promise<StoreCollection> => {
  const { name } = options.collection;

  const [columns, indexAttributes] = await Promise.all([
    listTableColumns(name, connection),
    listIndexAttributes(name, connection),
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
