import { StoreShapeType } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';

/**
 * A table column from the information_schema.columns table.
 */
export interface PostgreSQLColumn {
  column_name: string;
  data_type: string;
  list: boolean;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_nullable: boolean;
  is_auto_increment: boolean | null;
}

export const listTableColumns = async (
  connection: PostgreSQLConnection,
  tableName: string,
): Promise<PostgreSQLColumn[]> =>
  connection
    .query<PostgreSQLColumn>(listTableColumns_sql, [tableName])
    .then((result) => result.rows);

export const listTableColumns_sql = `SELECT c.column_name, COALESCE(o.data_type, c.data_type) as data_type,(c.data_type = 'ARRAY') as list, c.character_maximum_length, c.numeric_precision, c.numeric_scale, (c.is_nullable = 'YES') as is_nullable, c.column_default LIKE 'nextval(%)' AS is_auto_increment FROM information_schema.columns c LEFT JOIN information_schema.element_types o ON o.object_catalog = c.table_catalog AND o.object_schema = c.table_schema AND o.object_name = c.table_name AND o.object_type = 'TABLE' AND o.collection_type_identifier = c.dtd_identifier WHERE c.table_catalog = current_database() AND c.table_schema = current_schema() AND c.table_name = $1`;

// will prduce typnames instead of data_type:
// export const listTableColumns_sql = `SELECT s.column_name, COALESCE(e.typname, t.typname) as data_type, a.attndims as dimensions,s.character_maximum_length, s.numeric_precision, s.numeric_scale, (s.is_nullable = 'YES') as is_nullable, s.column_default LIKE 'nextval(%)' AS is_auto_increment FROM information_schema.columns AS s JOIN pg_namespace AS n ON n.nspname = s.table_schema JOIN pg_class AS c ON c.relnamespace = n.oid AND c.relname = s.table_name JOIN pg_attribute AS a ON a.attrelid = c.oid AND a.attname = s.column_name JOIN pg_type t ON t.oid = a.atttypid LEFT JOIN pg_type e ON e.oid = t.typelem WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_name = $1`;

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
