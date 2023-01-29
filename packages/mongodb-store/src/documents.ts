import { StoreCollection, StoreError, StoreScalarValue } from '@neuledge/store';
import { Document, Binary, ObjectId } from 'mongodb';
import { escapeFieldName, unescapeFieldName } from './fields';

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
export const escapeDocument = <T>(
  { primaryKey }: StoreCollection,
  doc: T,
): Document => {
  const primaryKeys = Object.keys(primaryKey.fields);
  let id;

  if (primaryKeys.length === 1) {
    const name = primaryKeys[0] as keyof T;
    const value = doc[name] as StoreScalarValue;
    id = escapeValue(value);
  } else {
    id = {} as Document;

    for (const name of Object.keys(primaryKey.fields)) {
      const value = doc[name as keyof T] as StoreScalarValue;
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
export const unescapeDocument = <T>(
  { primaryKey }: StoreCollection,
  doc: Document,
): T => {
  const primaryKeys = Object.keys(primaryKey.fields);
  const { _id: id, ...rest } = doc;
  let idValues;

  if (primaryKeys.length === 1) {
    const name = primaryKeys[0] as keyof T;
    idValues = {
      [name]: unescapeValue(id) as T[keyof T],
    } as Partial<T>;
  } else {
    idValues = unescapeValue(id) as Partial<T>;
  }

  for (const name of primaryKeys) {
    if (idValues[name as never] == null) {
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
  } as T;
};

/**
 * Escape a value to be stored in MongoDB.
 *
 * This function will convert valid buffer values to `Binary` and valid object
 * id buffers to `ObjectId`. All other values will be returned as is, except
 * `undefined` which will be converted to `null`. Symbol and function values are
 * not supported and will throw an error.
 */
const escapeValue = (value: StoreScalarValue | undefined): unknown => {
  switch (typeof value) {
    case 'object': {
      if (value === null) {
        return null;
      }

      if (Array.isArray(value)) {
        return value.map((v) => escapeValue(v));
      }

      if (value instanceof Uint8Array) {
        if (ObjectId.isValid(value)) {
          return new ObjectId(value);
        }

        return new Binary(value);
      }

      if (value instanceof ObjectId) {
        return value;
      }

      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, escapeValue(v)]),
      );
    }

    case 'undefined': {
      return null;
    }

    case 'number':
    case 'string':
    case 'boolean':
    case 'bigint': {
      return value;
    }

    case 'symbol':
    case 'function': {
      throw new Error(`Unexpected value type: ${typeof value}`);
    }
  }
};

/**
 * Unescape a value from MongoDB.
 * Please see `escapeValue()` for more details.
 *
 * @see escapeValue
 */
const unescapeValue = (value: unknown): StoreScalarValue => {
  switch (typeof value) {
    case 'object': {
      if (value instanceof Binary) {
        return value.buffer;
      }
      if (value instanceof ObjectId) {
        return value.id;
      }
      if (Array.isArray(value)) {
        return value.map((v) => unescapeValue(v));
      }
      if (value === null) {
        return null;
      }

      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, unescapeValue(v)]),
      );
    }

    case 'undefined': {
      return null;
    }

    case 'number':
    case 'string':
    case 'boolean':
    case 'bigint': {
      return value as StoreScalarValue;
    }

    case 'symbol':
    case 'function': {
      throw new Error(`Unexpected value type: ${typeof value}`);
    }
  }
};
