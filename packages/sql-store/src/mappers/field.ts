import { StoreError, StoreField, StoreShapeType } from '@neuledge/store';
import { SQLColumn } from '@/queries';

/**
 * Map the SQL data types to the corresponding StoreShapeType
 */
const dataTypeMap: Record<string, StoreShapeType> = {
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

export const toStoreField = (column: SQLColumn): StoreField => {
  const type = dataTypeMap[column.data_type];
  if (!type) {
    throw new StoreError(
      StoreError.Code.NOT_SUPPORTED,
      `Unsupported data type "${column.data_type}" for column "${column.column_name}"`,
    );
  }

  return {
    name: column.column_name,
    type,
    nullable: column.is_nullable === 'YES',
    size: column.character_maximum_length,
    precision: column.numeric_precision,
    scale: column.numeric_scale,
  };
};
