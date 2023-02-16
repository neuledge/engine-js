import { StoreScalarValue } from '@neuledge/store';
import { Binary, ObjectId } from 'mongodb';

/**
 * Escape a value to be stored in MongoDB.
 *
 * This function will convert valid buffer values to `Binary` and valid object
 * id buffers to `ObjectId`. All other values will be returned as is, except
 * `undefined` which will be converted to `null`. Symbol and function values are
 * not supported and will throw an error.
 */
export const escapeValue = (value: StoreScalarValue | undefined): unknown => {
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
export const unescapeValue = (value: unknown): StoreScalarValue => {
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
