import {
  StateDefinition,
  StateDefinitionWhere,
  StateFilter,
  StateName,
} from '@/definitions';
import { AllKeys } from './utils';

// This query is very similar to the `UniqueQuery`, if you make changes here,
// you probably want to make the same changes there.

export interface FilterQuery<S extends StateDefinition> {
  /**
   * Filter the returned entities by a where clause without using the indexes.
   * This is useful when you want to filter by a field that is not indexed.
   * Please note that this will be much slower (and sometimes costly) than using
   * the index.
   */
  filter(filter: Filter<S> | null): this;
}

export interface FilterQueryOptions<S extends StateDefinition> {
  filter?: Filter<S> | null;
}

export type Filter<S extends StateDefinition> = StateDefinitionWhere<
  NonCommonFilterKeys<S> extends never
    ? StateFilter<S>
    : StateFilter<S> & {
        [K in NonCommonFilterKeys<S>]?: null;
      }
>;

// Forbidden all non-common keys between the given states.
// Effectively doing an AND operator between all state values.
//
// For example, assume we have 2 states:
//   A. `{ id: number } | { category: number }`
//   B. `{ id: number }`
//
// We want to have only `{ id: number }` as a result so we run the following
// logic:
//   1. For each state:
//   1.1. Get all state keys (`id|category` and `id`)
//   1.2. Deduct it from states keys (`never` and `category`)
//   2. Combine result with an OR operator (`category`)
//   3. Forbidden the result from all keys (`id`)

type NonCommonFilterKeys<S extends StateDefinition> = {
  [K in StateName<S>]: Exclude<
    AllKeys<StateFilter<S>>,
    S extends StateDefinition<K> ? AllKeys<StateFilter<S>> : never
  >;
}[StateName<S>];
