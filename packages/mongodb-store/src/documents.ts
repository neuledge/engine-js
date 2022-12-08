import { StoreScalarValue } from '@neuledge/engine';
import { Document, Binary } from 'mongodb';
import { escapeFieldName, unescapeFieldName } from './fields';

export const escapeDocument = <T>(doc: T): Document =>
  Object.fromEntries(
    Object.entries(doc as object).map(([k, v]) => [escapeFieldName(k), v]),
  );

export const unescapeDocument = <T>(doc: Document): T =>
  Object.fromEntries(
    Object.entries(doc).map(([k, v]) => [
      unescapeFieldName(k),
      unescapeValue(v),
    ]),
  ) as T;

const unescapeValue = (value: unknown): StoreScalarValue => {
  if (value instanceof Binary) {
    return value.buffer;
  }

  return value as StoreScalarValue;
};
