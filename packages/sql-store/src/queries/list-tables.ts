import { SQLConnection } from './connection';

/**
 * The tables in the database. This is a view of the `information_schema.tables` table.
 */
export interface SQLTable {
  table_name: string;
}

export const listTables = async (
  connection: SQLConnection,
): Promise<SQLTable[]> =>
  connection.query<SQLTable[]>(
    `SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()`,
  );
