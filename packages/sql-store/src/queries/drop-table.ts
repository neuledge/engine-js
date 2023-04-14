import { SQLConnection } from './connection';

export const dropTableIfExists = async (
  connection: SQLConnection,
  tableName: string,
): Promise<void> => connection.query(dropTableIfExists_sql, [tableName]);

export const dropTableIfExists_sql = `DROP TABLE IF EXISTS ?`;
