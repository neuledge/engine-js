import { StoreShapeType } from '@neuledge/store';
import { SQLConnection } from '@neuledge/sql-store';

/**
 * A table column from the information_schema.columns table.
 */
export interface PostgreSQLColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_nullable: boolean;
  is_auto_increment: boolean | null;
}

export const listTableColumns = async (
  tableName: string,
  connection: SQLConnection,
): Promise<PostgreSQLColumn[]> =>
  connection.query<PostgreSQLColumn[]>(listTableColumns_sql, [tableName]);

export const listTableColumns_sql = `SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, (is_nullable = 'YES') as is_nullable, column_default LIKE 'nextval(%)' AS is_auto_increment
FROM information_schema.columns
WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_name = ?`;

// https://www.postgresql.org/docs/current/datatype.html
export const dataTypeMap: Record<string, StoreShapeType> = {
  bigint: 'number',
  bigserial: 'number',
  bit: 'string',
  'bit varying': 'string',
  boolean: 'boolean',
  box: 'string',
  bytea: 'string',
  character: 'string',
  'character varying': 'string',
  cidr: 'string',
  circle: 'string',
  date: 'string',
  'double precision': 'number',
  inet: 'string',
  integer: 'number',
  interval: 'string',
  json: 'json',
  jsonb: 'json',
  line: 'string',
  lseg: 'string',
  macaddr: 'string',
  money: 'string',
  numeric: 'number',
  path: 'string',
  pg_lsn: 'string',
  point: 'string',
  polygon: 'string',
  real: 'number',
  smallint: 'number',
  smallserial: 'number',
  serial: 'number',
  text: 'string',
  time: 'date-time',
  'time with time zone': 'date-time',
  'time without time zone': 'date-time',
  timestamp: 'date-time',
  'timestamp with time zone': 'date-time',
  'timestamp without time zone': 'date-time',
  tsquery: 'string',
  tsvector: 'string',
  txid_snapshot: 'string',
  uuid: 'string',
  xml: 'string',
};
