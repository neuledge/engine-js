import { SQLConnection } from '@neuledge/sql-store';

/**
 * The tables in the database. This is a view of the `information_schema.tables` table.
 */
export interface MySQLTable {
  table_name: string;
}

export const listTables = async (
  connection: SQLConnection,
): Promise<MySQLTable[]> =>
  connection.query<MySQLTable[]>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`,
  );
