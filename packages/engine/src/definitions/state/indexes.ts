import { SortDefinition, SortDefinitionKey } from './sort';

export interface StateDefinitionId<T> {
  auto?: 'increment';
  fields: SortDefinition<T>;
}

export interface StateDefinitionIndex<T> {
  fields: SortDefinition<T>;
  unique?: boolean;
}

export type InitiatedState<
  ID extends StateDefinitionId<T>,
  T,
> = ID['auto'] extends string
  ? {
      [K in Exclude<keyof T, SortDefinitionKey<ID['fields'][number]>>]: T[K];
    } & {
      [K in keyof T & SortDefinitionKey<ID['fields'][number]>]?: T[K] | null;
    }
  : T;
