import { StorePrimaryKey, StoreSort } from '@neuledge/store';
import { Sort } from 'mongodb';
import { escapeFieldName } from './fields';

export const sortFilter = (
  primaryKey: StorePrimaryKey,
  sort: StoreSort,
): Sort =>
  Object.fromEntries(
    Object.entries(sort).map(([k, v]) => [escapeFieldName(primaryKey, k), v]),
  );
