import { StoreDocument } from '@neuledge/store';
import {
  PostgreSQLConnection,
  encodeIdentifier,
  encodeLiteral,
} from './connection';

export const updateSet = async (
  connection: PostgreSQLConnection,
  name: string,
  set: StoreDocument,
  where: string | null,
): Promise<number> => {
  const setClauses = Object.entries(set).map(
    ([key, value]) =>
      `${encodeIdentifier(key)} = ${encodeLiteral(value ?? null)}`,
  );

  const res = await connection.query(
    `UPDATE ${encodeIdentifier(name)}\nSET ${setClauses.join(', ')}${
      where ? `\nWHERE ${where}` : ''
    }`,
  );

  return res.rowCount;
};
