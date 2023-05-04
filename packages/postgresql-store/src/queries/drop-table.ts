import format from 'pg-format';
import { PostgreSQLConnection } from './connection';

export const dropTableIfExists = async (
  connection: PostgreSQLConnection,
  tableName: string,
): Promise<void> => {
  await connection.query(`DROP TABLE IF EXISTS ${format.ident(tableName)}`);
};
