import { StoreCollection, StoreField } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

export const addColumn = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  field: StoreField,
): Promise<void> => {
  await connection.query(
    `ALTER TABLE ${format.literal(
      collection.name,
    )} ADD COLUMN ${getColumnDefinition(field, collection)}`,
  );
};

export const getColumnDefinition = (
  field: StoreField,
  collection: StoreCollection,
): string =>
  `${format.literal(field.name)} ${getColumnDataType(field, collection)}${
    field.nullable ? '' : ' NOT NULL'
  }`;

const getColumnDataType = (
  field: StoreField,
  collection: StoreCollection,
): string => {
  switch (field.type) {
    case 'string': {
      if (field.size) {
        return `VARCHAR(${field.size})`;
      }

      return 'TEXT';
    }

    case 'number': {
      return getNumberDateType(field, collection);
    }

    case 'date-time': {
      return 'TIMESTAMP';
    }

    case 'boolean': {
      return 'BOOLEAN';
    }

    case 'json': {
      return 'JSONB';
    }

    case 'enum': {
      return `ENUM(${field.values?.map((value) => `'${value}'`).join(', ')})`;
    }

    case 'binary': {
      return 'BYTEA';
    }

    default: {
      throw new Error(`Unsupported field type: ${field.type}`);
    }
  }
};

// https://www.postgresql.org/docs/current/datatype-numeric.html
const getNumberDateType = (
  field: StoreField,
  collection: StoreCollection,
): string => {
  if (field.scale === 0) {
    if (
      collection.primaryKey.auto === 'increment' &&
      collection.primaryKey.fields[field.name]
    ) {
      if (!field.precision || field.precision >= 10) {
        return 'BIGSERIAL';
      }

      if (field.precision < 5) {
        return 'SMALLSERIAL';
      }

      return 'SERIAL';
    }

    if (field.precision) {
      return `NUMERIC(${field.precision})`;
    }

    return 'BIGINT';
  }

  if (field.precision && field.scale) {
    return `NUMERIC(${field.precision}, ${field.scale})`;
  }

  return 'DOUBLE PRECISION';
};
