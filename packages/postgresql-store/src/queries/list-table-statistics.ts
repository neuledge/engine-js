import { PostgreSQLConnection } from './connection';

/**
 * A table statistic row from the information_schema.statistics table.
 */
export interface PostgreSQLIndexAttribute {
  index_name: string;
  column_name: string;
  seq_in_index: number;
  direction: 'ASC' | 'DESC';
  nulls: 'FIRST' | 'LAST';
  is_unique: boolean;
  is_primary: boolean;
}

export const listIndexAttributes = async (
  connection: PostgreSQLConnection,
  tableName: string,
): Promise<PostgreSQLIndexAttribute[]> => {
  const { rows } = await connection.query<PostgreSQLIndexAttribute>(
    listIndexAttributes_sql,
    [tableName],
  );

  for (const row of rows) {
    if (!row.index_name.startsWith(`${tableName}_`)) continue;

    row.index_name = row.index_name
      .slice(tableName.length + 1)
      .replace(/_idx$/, '');
  }

  return rows;
};

export const listIndexAttributes_sql =
  `SELECT` +
  ` irel.relname AS index_name,` +
  ` a.attname AS column_name,` +
  ` c.ordinality as seq_in_index,` +
  ` CASE o.option & 1 WHEN 1 THEN 'DESC' ELSE 'ASC' END AS direction,` +
  ` CASE o.option & 2 WHEN 2 THEN 'FIRST' ELSE 'LAST' END AS nulls,` +
  ` i.indisunique AS is_unique,` +
  ` i.indisprimary AS is_primary` +
  ` FROM pg_index AS i` +
  ` JOIN pg_class AS trel ON trel.oid = i.indrelid` +
  ` JOIN pg_namespace AS tnsp ON trel.relnamespace = tnsp.oid` +
  ` JOIN pg_class AS irel ON irel.oid = i.indexrelid` +
  ` CROSS JOIN LATERAL unnest (i.indkey) WITH ORDINALITY AS c (colnum, ordinality)` +
  ` LEFT JOIN LATERAL unnest (i.indoption) WITH ORDINALITY AS o (option, ordinality) ON c.ordinality = o.ordinality` +
  ` JOIN pg_attribute AS a ON trel.oid = a.attrelid AND a.attnum = c.colnum` +
  ` WHERE tnsp.nspname = current_schema() AND trel.relname = $1` +
  ` ORDER BY index_name, seq_in_index`;