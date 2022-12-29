export type SequenceFilters<V> =
  | WhereContainsFilter<V>
  | WhereStartsWithFilter<V>
  | WhereEndsWithFilter<V>;

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
