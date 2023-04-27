import { StoreDocument, StoreScalarValue } from '@neuledge/store';
import {
  PostgreSQLConnection,
  encodeIdentifier,
  encodeLiteral,
} from './connection';

export const insertInto = async (
  connection: PostgreSQLConnection,
  name: string,
  columns: string[],
  values: (StoreScalarValue | undefined)[][],
  returns: string[],
): Promise<StoreDocument[]> =>
  connection
    .query(
      `INSERT INTO ${encodeIdentifier(name)} (${columns
        .map((column) => encodeIdentifier(column))
        .join(', ')}) VALUES (${values
        .map((arr) =>
          arr
            .map((v) => (v === undefined ? 'DEFAULT' : encodeLiteral(v)))
            .join(', '),
        )
        .join('), (')}) RETURNING ${returns
        .map((column) => encodeIdentifier(column))
        .join(', ')}`,
    )
    .then((res) => res.rows);
