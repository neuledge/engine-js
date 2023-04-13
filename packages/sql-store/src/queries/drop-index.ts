import { SQLConnection } from './connection';

export const dropIndex = async (
  tableName: string,
  index: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`DROP INDEX ? ON ?`, [index, tableName]);
};
