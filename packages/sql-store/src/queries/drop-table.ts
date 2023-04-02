import { SQLConnection } from './connection';

export const dropTableIfExists = async (
  connection: SQLConnection,
  tableName: string,
): Promise<void> => connection.query(`DROP TABLE IF EXISTS ?`, [tableName]);
