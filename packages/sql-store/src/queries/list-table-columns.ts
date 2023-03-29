import { SQLConnection } from './connection';

/**
 * A table column from the information_schema.columns table.
 */
export interface SQLColumn {
  column_name: string;
  data_type: string;
  character_maximum_length?: number | null;
  numeric_precision?: number | null;
  numeric_scale?: number | null;
  is_nullable: 'YES' | 'NO';
}

export const listTableColumns = async (
  connection: SQLConnection,
  tableName: string,
): Promise<SQLColumn[]> =>
  connection.query<SQLColumn[]>(
    `SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, is_nullable
FROM information_schema.columns
WHERE table_name = ? AND table_schema = DATABASE()`,
    [tableName],
  );
