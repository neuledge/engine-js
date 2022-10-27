import { StoreDocumentValue } from './document.js';

// TODO support advance where
export type StoreWhere = Record<FieldName, StoreWhereTerm> | StoreWhereOrTerm;

type FieldName = string;

export type StoreWhereTerm =
  | StoreWhereEqualTerm
  | StoreWhereNotEqualTerm
  | StoreWhereInTerm
  | StoreWhereNotInTerm;

export interface StoreWhereEqualTerm {
  $eq: StoreDocumentValue;
}
export interface StoreWhereNotEqualTerm {
  $ne: StoreDocumentValue;
}

export interface StoreWhereInTerm {
  $in: StoreDocumentValue[];
}

export interface StoreWhereNotInTerm {
  $nin: StoreDocumentValue[];
}

export interface StoreWhereOrTerm {
  $or: StoreWhere[];
}
