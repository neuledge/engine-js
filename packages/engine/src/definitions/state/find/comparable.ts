export type ComparableFilters<V> =
  | WhereLowerThenFilter<V>
  | WhereLowerThenEqualFilter<V>
  | WhereGreaterThenFilter<V>
  | WhereGreaterThenEqualFilter<V>;

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
