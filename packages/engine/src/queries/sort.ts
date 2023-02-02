import { StateDefinition, StateIndexes, StateType } from '@/definitions';

export interface SortQuery<S extends StateDefinition> {
  /**
   * Sort the returned entities by a sort index.
   * The index name must be prefixed with a '+' or '-' to indicate the sort
   * direction. For example: `sort('+name')` or `sort('-name')`.
   * Only the predefined indexes on the states can be used here, use "*" to sort
   * by arbitrary fields.
   */
  sort(sort: SortIndex<S> | null): this;

  /**
   * Sort the returned entities by arbitrary fields.
   * The field name must be prefixed with a '+' or '-' to indicate the sort
   * direction. For example: `sort('*', '+firstName', '-lastVisit')`.
   */
  sort(sort: '*', ...fields: SortField<S>[]): this;
}

export interface SortQueryOptions<S extends StateDefinition> {
  sort?: Sort<S> | null;
}

export type Sort<S extends StateDefinition> =
  | SortIndex<S>
  | readonly SortField<S>[];

export type SortIndex<S extends StateDefinition> = SortedField<
  {
    [K in keyof StateIndexes<S>]: StateIndexes<S>[K]['unique'] extends true
      ? never
      : K;
  }[keyof StateIndexes<S>] &
    string
>;

export type SortField<S extends StateDefinition> = SortedField<
  keyof StateType<S> & string
>;

type SortedField<K extends string> = `${'+' | '-'}${K}`;
