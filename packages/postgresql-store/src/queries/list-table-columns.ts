import { StoreShapeType } from '@neuledge/store';
import { SQLConnection } from './connection';

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
  is_auto_increment: boolean;
}

export const listTableColumns = async (
  tableName: string,
  connection: SQLConnection,
): Promise<PostgreSQLColumn[]> =>
  connection.query<PostgreSQLColumn[]>(
    `SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, (is_nullable = 'YES') as is_nullable, column_default LIKE 'nextval(%)' AS is_auto_increment
    FROM information_schema.columns
    WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_name = ?`,
    [tableName],
  );

export const dataTypeMap: Record<string, StoreShapeType> = {
  character: 'string',
  'character varying': 'string',
  'double precision': 'number',
  smallint: 'number',
  real: 'number',
  'timestamp without time zone': 'date-time',
  'timestamp with time zone': 'date-time',
  'time without time zone': 'date-time',
  'time with time zone': 'date-time',
  'interval year to month': 'date-time',
  'interval day to second': 'date-time',
  'bit varying': 'binary',
  bit: 'binary',
  varbit: 'binary',
  bytea: 'binary',
  text: 'string',
  json: 'json',
  jsonb: 'json',
  uuid: 'string',
  xml: 'string',
  cidr: 'string',
  inet: 'string',
  macaddr: 'string',
  tsvector: 'string',
  tsquery: 'string',
  regconfig: 'string',
  regdictionary: 'string',
  regnamespace: 'string',
  regoper: 'string',
  regoperator: 'string',
  regproc: 'string',
  regprocedure: 'string',
  regrole: 'string',
  regtype: 'string',
  int2: 'number',
  int4: 'number',
  int8: 'number',
  float4: 'number',
  float8: 'number',
  bool: 'boolean',
  date: 'date-time',
  time: 'date-time',
  timestamp: 'date-time',
  timestamptz: 'date-time',
  interval: 'date-time',
  numeric: 'number',
  decimal: 'number',
  money: 'number',
};
