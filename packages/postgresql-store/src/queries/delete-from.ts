import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const deleteFrom = async (
  connection: PostgreSQLConnection,
  name: string,
  where: string | null,
): Promise<number> => {
  const res = await connection.query(
    where
      ? `DELETE FROM ${encodeIdentifier(name)} WHERE ${where}`
      : `TRUNCATE TABLE ${encodeIdentifier(name)}`,
  );

  return res.rowCount;
};
