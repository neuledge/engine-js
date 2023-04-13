import { SQLConnection } from './connection';

export const dropColumn = async (
  tableName: string,
  field: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`ALTER TABLE ? DROP COLUMN ?`, [tableName, field]);
};
