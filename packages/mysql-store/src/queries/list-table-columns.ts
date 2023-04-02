import { StoreShapeType } from '@neuledge/store';
import { SQLConnection } from '@neuledge/sql-store';

/**
 * A table column from the information_schema.columns table.
 */
export interface MySQLColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_nullable: 1 | 0;
  is_auto_increment: 1 | 0;
}

export const listTableColumns = async (
  tableName: string,
  connection: SQLConnection,
): Promise<MySQLColumn[]> =>
  connection.query<MySQLColumn[]>(
    `SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, (is_nullable = 'YES') AS is_nullable, extra LIKE '%auto_increment%' AS is_auto_increment
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName],
  );

export const dataTypeMap: Record<string, StoreShapeType> = {
  varchar: 'string',
  char: 'string',
  text: 'string',
  numeric: 'number',
  decimal: 'number',
  float: 'number',
  double: 'number',
  integer: 'number',
  bigint: 'number',
  boolean: 'boolean',
  bytea: 'binary',
  timestamp: 'date-time',
  timestamptz: 'date-time',
  json: 'json',
  jsonb: 'json',
};
