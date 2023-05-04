import { MySQLConnection } from './connection';

/**
 * The tables in the database. This is a view of the `information_schema.tables` table.
 */
export interface MySQLTable {
  table_name: string;
}

export const listTables = async (
  connection: MySQLConnection,
): Promise<MySQLTable[]> =>
  new Promise((resolve, reject) =>
    connection.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`,
      (error, results) => (error ? reject(error) : resolve(results)),
    ),
  );
