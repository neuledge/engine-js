import {
  StoreCollection,
  StoreDocument,
  StoreError,
  StoreScalarValue,
} from '@neuledge/store';
import { Document } from 'mongodb';
import { escapeFieldName, unescapeFieldName } from './fields';
import { escapeValue, unescapeValue } from './values';

/**
 * Escape a document to be stored in MongoDB. This function will also
 * create the `_id` field for the document. If the collection has multiple
 * primary keys, the `_id` field will be an object with the primary key fields
 * as properties. Otherwise, the `_id` field will be the value of the primary
 * key field.
 *
 * Any other field will be escaped using `escapeFieldName()` so original `_id`
 * field will be escaped to `_id_org` and so on.
 */
export const escapeDocument = (
  { primaryKey }: StoreCollection,
  doc: StoreDocument,
): Document => {
  const primaryKeys = Object.keys(primaryKey.fields);
  let id;

  if (primaryKeys.length === 1) {
    const name = primaryKeys[0];
    const value = doc[name] as StoreScalarValue;
    id = escapeValue(value);
  } else {
    id = {} as Document;

    for (const name of Object.keys(primaryKey.fields)) {
      const value = doc[name];
      id[name] = escapeValue(value);
    }
  }

  return Object.fromEntries([
    ['_id', id],
    ...Object.entries(doc as object)
      .filter(([k]) => !primaryKey.fields[k])
      .map(([k, v]) => [escapeFieldName(k), escapeValue(v)]),
  ]);
};

/**
 * Unescape a document from MongoDB.
 * Please see `escapeDocument()` for more details.
 *
 * @see escapeDocument
 */
export const unescapeDocument = (
  { primaryKey }: StoreCollection,
  doc: Document,
): StoreDocument => {
  const primaryKeys = Object.keys(primaryKey.fields);
  const { _id: id, ...rest } = doc;
  let idValues;

  if (primaryKeys.length === 1) {
    const name = primaryKeys[0];
    idValues = {
      [name]: unescapeValue(id),
    };
  } else {
    idValues = (unescapeValue(id) ?? {}) as Record<string, StoreScalarValue>;
  }

  for (const name of primaryKeys) {
    if (idValues[name] == null) {
      throw new StoreError(
        StoreError.Code.INVALID_DATA,
        `Missing primary key '${name}' in document storage`,
      );
    }
  }

  return {
    ...idValues,
    ...Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [
        unescapeFieldName(k),
        unescapeValue(v),
      ]),
    ),
  };
};
