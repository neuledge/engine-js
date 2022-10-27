import { StoreDocumentValue } from './document.js';

export type StoreWhere =
  | Record<FieldName, StoreWhereFilter>
  | StoreWhereOrFilter;

type FieldName = string;

export type StoreWhereFilter =
  | StoreWhereEqualsFilter
  | StoreWhereNotEqualsFilter
  | StoreWhereLowerThenFilter
  | StoreWhereLowerThenEqualFilter
  | StoreWhereGreaterThenFilter
  | StoreWhereGreaterThenEqualFilter
  | StoreWhereContainsFilter
  | StoreWhereStartsWithFilter
  | StoreWhereEndsWithFilter
  | StoreWhereInFilter
  | StoreWhereNotInFilter;

export interface StoreWhereOrFilter {
  $or: StoreWhere[];
}

export interface StoreWhereEqualsFilter {
  $eq: StoreDocumentValue;
}

export interface StoreWhereNotEqualsFilter {
  $ne: StoreDocumentValue;
}

export interface StoreWhereLowerThenFilter {
  $lt: StoreDocumentValue;
}

export interface StoreWhereLowerThenEqualFilter {
  $lte: StoreDocumentValue;
}

export interface StoreWhereGreaterThenFilter {
  $gt: StoreDocumentValue;
}

export interface StoreWhereGreaterThenEqualFilter {
  $gte: StoreDocumentValue;
}

export interface StoreWhereContainsFilter {
  $contains: StoreDocumentValue;
}

export interface StoreWhereStartsWithFilter {
  $startsWith: StoreDocumentValue;
}

export interface StoreWhereEndsWithFilter {
  $endsWith: StoreDocumentValue;
}

export interface StoreWhereInFilter {
  $in: StoreDocumentValue[];
}

export interface StoreWhereNotInFilter {
  $nin: StoreDocumentValue[];
}
