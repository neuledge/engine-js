import { StateDefinition, StateIndexes, StateType } from '@/definitions';

export interface SortQuery<S extends StateDefinition> {
  sort(sort: SortIndex<S> | null): this;
  sort(sort: '*', ...fields: SortField<S>[]): this;
}

export interface SortQueryOptions<S extends StateDefinition> {
  sort?: Sort<S>;
}

export type Sort<S extends StateDefinition> =
  | SortIndex<S>
  | readonly SortField<S>[];

export type SortIndex<S extends StateDefinition> = SortedField<
  keyof StateIndexes<S> & string
>;

export type SortField<S extends StateDefinition> = SortedField<
  keyof StateType<S> & string
>;

type SortedField<K extends string> = `${'+' | '-'}${K}`;
