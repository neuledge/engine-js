import { UpdateFilter, Document } from 'mongodb';
import { escapeFieldName } from './fields';

export const updateFilter = (set: Document): UpdateFilter<Document> => ({
  $set: Object.fromEntries(
    Object.entries(set)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [escapeFieldName(k), v]),
  ),

  $unset: Object.fromEntries(
    Object.entries(set)
      .filter(([, v]) => v == null)
      .map(([k]) => [escapeFieldName(k), 1]),
  ),
});
