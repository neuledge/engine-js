import { MySQLConnection } from './connection';

/**
 * A table statistic row from the information_schema.statistics table.
 */
export interface MySQLIndexAttribute {
  index_name: string;
  column_name: string;
  seq_in_index: number;
  direction: 'ASC' | 'DESC';
  is_unique: 1 | 0;
  is_primary: 1 | 0;
}

export const listIndexAttributes = async (
  connection: MySQLConnection,
  tableName: string,
): Promise<MySQLIndexAttribute[]> =>
  new Promise((resolve, reject) =>
    connection.query(
      `SELECT index_name, column_name, seq_in_index, CASE collation WHEN 'A' THEN 'ASC' ELSE 'DESC' END AS direction, non_unique, (index_name == 'PRIMARY') as is_primary
    FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = ? 
    ORDER BY index_name, seq_in_index`,
      [tableName],
      (error, results) => (error ? reject(error) : resolve(results)),
    ),
  );
