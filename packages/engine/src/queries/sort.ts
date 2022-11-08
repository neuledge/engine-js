import { State, StateIndexes } from '@/generated/index.js';

export interface SortQuery<S extends State> {
  sort(sort: SortIndex<S> | null): this;
  sort(sort: '*', ...fields: SortField<S>[]): this;
}

export interface SortQueryOptions<S extends State> {
  sort?: Sort<S>;
}

export type Sort<S extends State> = SortIndex<S> | readonly SortField<S>[];

export type SortIndex<S extends State> = SortedField<
  keyof StateIndexes<S> & string
>;

export type SortField<S extends State> = SortedField<
  keyof InstanceType<S> & string
>;

type SortedField<K extends string> = `${'+' | '-'}${K}`;
