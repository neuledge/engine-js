import { MySQLConnection } from './connection';

export const dropTableIfExists = async (
  connection: MySQLConnection,
  tableName: string,
): Promise<void> => {};
