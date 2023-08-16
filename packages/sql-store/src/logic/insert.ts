import { parseRawDocument } from '@/helpers';
import {
  StoreDocument,
  StoreField,
  StoreInsertOptions,
  StoreInsertionResponse,
  StoreScalarValue,
  throwStoreError,
} from '@neuledge/store';

export interface InsertQueries<Connection> {
  insertInto(
    connection: Connection,
    name: string,
    columns: StoreField[],
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

  const columns = Object.values(fields);

  const values = documents.map((document) =>
    columns.map(
      (column) =>
        document[column.name] ??
        (primaryKey.fields[column.name] ? undefined : null),
    ),
  );

  const returns = Object.keys(primaryKey.fields);

  const res = await insertInto(
    connection,
    name,
    columns,
    values,
    returns,
  ).catch(throwStoreError);

  return {
    affectedCount: res.length,
    insertedIds: res.map((rawDoc) => parseRawDocument(fields, rawDoc)),
  };
};
