import { StoreDocument, StoreScalarValue } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

// FIXME support format.literal for any scalar value

export const insertInto = async (
  connection: PostgreSQLConnection,
  name: string,
  columns: string[],
  values: (StoreScalarValue | undefined)[][],
  returns: string[],
): Promise<StoreDocument[]> =>
  connection
    .query(
      `INSERT INTO ${format.ident(name)} (${columns
        .map((column) => format.ident(column))
        .join(', ')})
VALUES (${values
        .map((arr) =>
          arr
            .map((v) =>
              v === undefined ? 'DEFAULT' : format.literal(v as never),
            )
            .join(', '),
        )
        .join('), (')})
RETURNING ${returns.map((column) => format.ident(column)).join(', ')}`,
    )
    .then((res) => res.rows);
