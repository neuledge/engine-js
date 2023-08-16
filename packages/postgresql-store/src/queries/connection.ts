import { QueryHelpers } from '@neuledge/sql-store';
import {
  StoreError,
  StoreField,
  StoreScalarValue,
  StoreShape,
} from '@neuledge/store';
import { Client, Pool } from 'pg';
import format from 'pg-format';
import { getColumnDataType } from './add-column';

export type PostgreSQLConnection = Pick<Client | Pool, 'query'>;

export const encodeIdentifier = format.ident;

export const encodeLiteral = (val: StoreScalarValue, field: StoreField) => {
  if (field.list) {
    if (!Array.isArray(val)) {
      throw new StoreError(
        StoreError.Code.INVALID_INPUT,
        `Expected array value for field ${field.name} but got ${val}`,
      );
    }

    if (!val.length) {
      return `ARRAY[]::${getColumnDataType(field)}[]`;
    }

    return `ARRAY[${val.map((v) => encodeScalar(v, field)).join(', ')}]`;
  }

  return encodeScalar(val, field);
};

const encodeScalar = (val: StoreScalarValue, shape: StoreShape) => {
  if (shape.type === 'json') {
    return `${format.literal(JSON.stringify(val))}::JSONB`;
  }

  // format.literal will convert everything else to string which will work fine for bigint
  return format.literal(val as Exclude<StoreScalarValue, bigint>);
};

export const queryHelpers: QueryHelpers = {
  encodeIdentifier,
  encodeLiteral,
};
