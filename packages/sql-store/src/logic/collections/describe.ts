import {
  SQLColumn,
  SQLIndexAttribute,
  SQLIndexColumn,
  toStoreField,
  toStoreIndex,
} from '@/mappers';
import {
  StoreCollection,
  StoreDescribeCollectionOptions,
  StoreError,
  StoreShapeType,
} from '@neuledge/store';

export interface DescribeCollectionQueries<
  Connection,
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
> {
  listTableColumns(connection: Connection, name: string): Promise<Column[]>;
  listIndexAttributes(
    connection: Connection,
    name: string,
  ): Promise<IndexAttribute[]>;
  dataTypeMap: Record<string, StoreShapeType>;
}

export const describeCollection = async <
  Connection,
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
>(
  options: StoreDescribeCollectionOptions,
  connection: Connection,
  queries: DescribeCollectionQueries<Connection, Column, IndexAttribute>,
): Promise<StoreCollection> => {
  const { name, fields, indexColumns } = await getCollectionDetails(
    options,
    connection,
    queries,
  );

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

const getCollectionDetails = async <
  Connection,
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
>(
  options: StoreDescribeCollectionOptions,
  connection: Connection,
  {
    listTableColumns,
    listIndexAttributes,
    dataTypeMap,
  }: DescribeCollectionQueries<Connection, Column, IndexAttribute>,
) => {
  const { name } = options.collection;

  const [columns, indexAttributes] = await Promise.all([
    listTableColumns(connection, name),
    listIndexAttributes(connection, name),
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

  return { name, fields, indexColumns };
};

const groupIndexColumns = <
  Column extends SQLColumn,
  IndexAttribute extends SQLIndexAttribute & Omit<SQLIndexColumn, keyof Column>,
>(
  columnMap: Record<string, Column>,
  indexAttributes: IndexAttribute[],
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
