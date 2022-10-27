import { State, StateIndexes } from '@/generated/index.js';

export interface SortQuery<S extends State> {
  sort(sort: SortIndex<S> | null): this;
  sort(sort: '*', ...fields: SortField<S>[]): this;
}

export interface SortQueryOptions<S extends State> {
  sort?: SortIndex<S> | SortField<S>[];
}

export type SortIndex<S extends State> = keyof StateIndexes<S>;

export type SortField<S extends State> = `${'+' | '-'}${keyof InstanceType<S> &
  string}`;
