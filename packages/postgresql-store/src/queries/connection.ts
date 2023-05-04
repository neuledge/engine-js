import { QueryHelpers } from '@neuledge/sql-store';
import { StoreScalarValue } from '@neuledge/store';
import { Client, Pool } from 'pg';
import format from 'pg-format';

export type PostgreSQLConnection = Pick<Client | Pool, 'query'>;

export const encodeIdentifier = format.ident;

export const encodeLiteral = (val: StoreScalarValue) =>
  // format.literal will convert everything else to string which will work fine for bigint
  format.literal(val as Exclude<StoreScalarValue, bigint>);

export const queryHelpers: QueryHelpers = {
  encodeIdentifier,
  encodeLiteral,
};
