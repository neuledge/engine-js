import { SQLConnection } from '@neuledge/sql-store';

/**
 * The tables in the database. This is a view of the `information_schema.tables` table.
 */
export interface PostgreSQLTable {
  table_name: string;
}

export const listTables = async (
  connection: SQLConnection,
): Promise<PostgreSQLTable[]> =>
  connection.query<PostgreSQLTable[]>(listTables_sql);

export const listTables_sql = `SELECT table_name 
FROM information_schema.tables 
WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_type = 'BASE TABLE'`;
