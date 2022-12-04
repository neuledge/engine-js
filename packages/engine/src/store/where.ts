import { StoreScalarValue } from './document';

export type StoreWhere = StoreWhereRecord | StoreWhereOr;

export type StoreWhereRecord = Record<FieldName, StoreWhereTerm>;

type FieldName = string;

export type StoreWhereTerm =
  | StoreWhereEquals
  | StoreWhereNotEquals
  | StoreWhereLowerThen
  | StoreWhereLowerThenEqual
  | StoreWhereGreaterThen
  | StoreWhereGreaterThenEqual
  | StoreWhereContains
  | StoreWhereStartsWith
  | StoreWhereEndsWith
  | StoreWhereIn
  | StoreWhereNotIn;

export interface StoreWhereOr {
  $or: StoreWhereRecord[];
}

export interface StoreWhereEquals {
  $eq: StoreScalarValue;
}

export interface StoreWhereNotEquals {
  $ne: StoreScalarValue;
}

export interface StoreWhereLowerThen {
  $lt: StoreScalarValue;
}

export interface StoreWhereLowerThenEqual {
  $lte: StoreScalarValue;
}

export interface StoreWhereGreaterThen {
  $gt: StoreScalarValue;
}

export interface StoreWhereGreaterThenEqual {
  $gte: StoreScalarValue;
}

export interface StoreWhereContains {
  $contains: StoreScalarValue;
}

export interface StoreWhereStartsWith {
  $startsWith: StoreScalarValue;
}

export interface StoreWhereEndsWith {
  $endsWith: StoreScalarValue;
}

export interface StoreWhereIn {
  $in: StoreScalarValue[];
}

export interface StoreWhereNotIn {
  $nin: StoreScalarValue[];
}
