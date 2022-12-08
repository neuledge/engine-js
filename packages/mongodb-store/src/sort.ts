import { StoreSort } from '@neuledge/engine';
import { Sort } from 'mongodb';
import { escapeFieldName } from './fields';

export const sortFilter = (sort: StoreSort): Sort =>
  Object.fromEntries(
    Object.entries(sort).map(([k, v]) => [escapeFieldName(k), v]),
  );
