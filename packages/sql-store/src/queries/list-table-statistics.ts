import { SQLConnection } from './connection';

/**
 * A table statistic row from the information_schema.statistics table.
 */
export interface SQLStatistic {
  index_name: string;
  column_name: string;
  seq_in_index: number;
  collation: 'A' | 'D';
  non_unique: number;
  column_extra?: string;
}

export const listTableStatistics = async (
  connection: SQLConnection,
  tableName: string,
): Promise<SQLStatistic[]> =>
  connection.query<SQLStatistic[]>(
    `SELECT index_name, column_name, seq_in_index, collation, non_unique, extra AS column_extra
    FROM information_schema.statistics INNER JOIN information_schema.columns USING (table_schema, table_name, column_name)
    WHERE table_schema = DATABASE() AND table_name = ? 
    ORDER BY index_name, seq_in_index`,
    [tableName],
  );
