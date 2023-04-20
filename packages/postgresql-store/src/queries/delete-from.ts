import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const deleteFrom = async (
  connection: PostgreSQLConnection,
  name: string,
  where: string | null,
  limit: number,
): Promise<number> => {
  const res = await connection.query(
    `DELETE FROM ${encodeIdentifier(name)}${
      where
        ? `
WHERE ${where}`
        : ''
    }
LIMIT ${Number(limit)}`,
  );

  return res.rowCount;
};
