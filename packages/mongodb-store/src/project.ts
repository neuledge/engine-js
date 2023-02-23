import { StorePrimaryKey, StoreSelect } from '@neuledge/store';
import { Document } from 'mongodb';
import { escapeFieldName } from './fields';

export const projectFilter = (
  primaryKey: StorePrimaryKey,
  fields: StoreSelect,
): Document =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k]) => [escapeFieldName(primaryKey, k), 1]),
  );
