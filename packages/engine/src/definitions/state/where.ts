// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateDefinitionWhere<T = any> =
  | StateDefinitionWhereRecord<T>
  | StateDefinitionWhereOr<T>;

interface StateDefinitionWhereOr<T> {
  $or: StateDefinitionWhereRecord<T>[];
}

export type StateDefinitionWhereRecord<T> = {
  [K in keyof T]?: T[K];
};

export type StateDefinitionWhereTerm<V> =
  | StateDefinitionWhereNullableObject<V & object>
  | StateDefinitionWhereNullableNumber<V & number>
  | StateDefinitionWhereNullableString<V & string>
  | StateDefinitionWhereNullableBoolean<V & boolean>;

export type StateDefinitionWhereId<V extends object> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateDefinitionWhereNullableId<V extends object> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>
  | WhereInFilter<V | null>
  | WhereNotInFilter<V | null>;

export type StateDefinitionWhereObject<V extends object> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateDefinitionWhereNullableObject<V extends object> =
  | WhereEqualsFilter<V | null>
  | WhereNotEqualsFilter<V | null>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V | null>
  | WhereNotInFilter<V | null>;

export type StateDefinitionWhereNumber<V extends number> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

export type StateDefinitionWhereNullableNumber<V extends number> =
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

export type StateDefinitionWhereNullableString<V extends string> =
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

export type StateDefinitionWhereBoolean<V extends boolean> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>;

export type StateDefinitionWhereNullableBoolean<V extends boolean> =
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

interface WhereNotInFilter<V> {
  $nin: V[];
  $eq?: never;
}
