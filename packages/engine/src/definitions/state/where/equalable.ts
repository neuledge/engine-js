export type EqualableFilters<V> =
  | WhereEqualsFilter<V>
  | WhereNotEqualsFilter<V>
  | WhereInFilter<V>
  | WhereNotInFilter<V>;

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

interface WhereInFilter<V> {
  $in: V[];
  $eq?: never;
}

interface WhereNotInFilter<V> {
  $nin: V[];
  $eq?: never;
}
