import { StoreDocument } from '@neuledge/store';
import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const selectFrom = async (
  connection: PostgreSQLConnection,
  name: string,
  select: string[] | true,
  where: string | null,
  limit: number,
  offset: number,
): Promise<StoreDocument[]> => {
  const { rows } = await connection.query(
    `SELECT ${
      select === true
        ? '*'
        : select.map((column) => encodeIdentifier(column)).join(', ')
    }
FROM ${encodeIdentifier(name)}${
      where
        ? `
WHERE ${where}`
        : ''
    }
LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
  );

  return rows;
};
