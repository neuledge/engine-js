import { StoreSelect } from '@neuledge/store';
import { Document } from 'mongodb';
import { escapeFieldName } from './fields';

export const projectFilter = (fields: StoreSelect): Document =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k]) => [escapeFieldName(k), 1]),
  );
