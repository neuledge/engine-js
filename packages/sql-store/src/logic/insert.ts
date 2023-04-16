import {
  StoreDocument,
  StoreInsertOptions,
  StoreInsertionResponse,
  StoreScalarValue,
} from '@neuledge/store';

export interface InsertQueries<Connection> {
  insertInto(
    connection: Connection,
    name: string,
    columns: string[],
    values: (StoreScalarValue | undefined)[][],
    returns: string[],
  ): Promise<StoreDocument[]>;
}

export const insert = async <Connection>(
  options: StoreInsertOptions,
  connection: Connection,
  { insertInto }: InsertQueries<Connection>,
): Promise<StoreInsertionResponse> => {
  const { collection, documents } = options;
  const { name, fields, primaryKey } = collection;

  const columns = Object.keys(fields);

  const values = documents.map((document) =>
    columns.map(
      (column) =>
        document[column] ?? (primaryKey.fields[column] ? undefined : null),
    ),
  );

  const returns = Object.keys(primaryKey.fields);

  const res = await insertInto(connection, name, columns, values, returns);

  return {
    affectedCount: res.length,
    insertedIds: res,
  };
};
