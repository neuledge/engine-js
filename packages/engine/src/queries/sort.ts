import {
  StateDefinition,
  StateDefinitionIndexes,
  StateDefinitionType,
} from '@/definitions/index.js';

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
  keyof StateDefinitionIndexes<S> & string
>;

export type SortField<S extends StateDefinition> = SortedField<
  keyof StateDefinitionType<S> & string
>;

type SortedField<K extends string> = `${'+' | '-'}${K}`;
