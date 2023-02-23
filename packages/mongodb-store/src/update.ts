import { StorePrimaryKey } from '@neuledge/store';
import { UpdateFilter, Document } from 'mongodb';
import { escapeFieldName } from './fields';

export const updateFilter = (
  primaryKey: StorePrimaryKey,
  set: Document,
): UpdateFilter<Document> => ({
  $set: Object.fromEntries(
    Object.entries(set)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [escapeFieldName(primaryKey, k), v]),
  ),

  $unset: Object.fromEntries(
    Object.entries(set)
      .filter(([, v]) => v == null)
      .map(([k]) => [escapeFieldName(primaryKey, k), 1]),
  ),
});
