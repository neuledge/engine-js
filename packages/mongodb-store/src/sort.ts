import { StoreSort } from '@neuledge/store';
import { Sort } from 'mongodb';
import { escapeFieldName } from './fields';

export const sortFilter = (sort: StoreSort): Sort =>
  Object.fromEntries(
    Object.entries(sort).map(([k, v]) => [escapeFieldName(k), v]),
  );
