import { StoreScalarValue } from '@neuledge/store';
import { Document, Binary, ObjectId } from 'mongodb';
import { escapeFieldName, unescapeFieldName } from './fields';

export const escapeDocument = <T>(doc: T): Document =>
  Object.fromEntries(
    Object.entries(doc as object).map(([k, v]) => [
      escapeFieldName(k),
      escapeValue(v),
    ]),
  );

export const unescapeDocument = <T>(doc: Document): T =>
  Object.fromEntries(
    Object.entries(doc).map(([k, v]) => [
      unescapeFieldName(k),
      unescapeValue(v),
    ]),
  ) as T;

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
