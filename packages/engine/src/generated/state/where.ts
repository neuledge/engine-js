export type StateWhere<T> = StateWhereRecord<T> | StateWhereOr<T>;

interface StateWhereOr<T> {
  $or: StateWhereRecord<T>[];
}

export type StateWhereRecord<T> = {
  [K in keyof T]?: T[K];
};

export type StateWhereTerm<V> =
  | StateWhereNullableObject<V & object>
  | StateWhereNullableNumber<V & number>
  | StateWhereNullableString<V & string>
  | StateWhereNullableBoolean<V & boolean>;

export type StateWhereObject<V extends object> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateWhereNullableObject<V extends object> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V | null>
  | WhereNotInFilter<V | null>;

export type StateWhereNumber<V extends number> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateWhereNullableNumber<V extends number> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V | null>
  | WhereNotInFilter<V | null>;

export type StateWhereString<V extends string> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereContainsFilter<V>
  | WhereStartsWithFilter<V>
  | WhereEndsWithFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateWhereNullableString<V extends string> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereContainsFilter<V>
  | WhereStartsWithFilter<V>
  | WhereEndsWithFilter<V>
  | WhereInFilter<V | null>
  | WhereNotInFilter<V | null>;

export type StateWhereBoolean<V extends boolean> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>;

export type StateWhereNullableBoolean<V extends boolean> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>;

interface WhereEqualsFilter<V> {
  $eq: V;
  $ne?: never;
  $lt?: never;
  $lte?: never;
  $gt?: never;
  $gte?: never;
  $contains?: never;
  $startsWith?: never;
  $endsWith?: never;
  $in?: never;
  $notIn?: never;
}

interface WhereNotEqualsFilter<V> {
  $ne: V;
}

interface WhereLowerThenFilter<V> {
  $lt: V;
  $lte?: never;
  $eq?: never;
}

interface WhereLowerThenEqualFilter<V> {
  $lte: V;
  $lt?: never;
  $eq?: never;
}

interface WhereGreaterThenFilter<V> {
  $gt: V;
  $gte?: never;
  $eq?: never;
}

interface WhereGreaterThenEqualFilter<V> {
  $gte: V;
  $gt?: never;
  $eq?: never;
}

interface WhereContainsFilter<V> {
  $contains: V;
  $eq?: never;
}

interface WhereStartsWithFilter<V> {
  $startsWith: V;
  $eq?: never;
}

interface WhereEndsWithFilter<V> {
  $endsWith: V;
  $eq?: never;
}

interface WhereInFilter<V> {
  $in: V[];
  $eq?: never;
}

export interface WhereNotInFilter<V> {
  $nin: V[];
  $eq?: never;
}
