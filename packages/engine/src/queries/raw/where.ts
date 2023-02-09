import { StateDefinition, StateName, StateFind } from '@/definitions';
import { AllKeys } from './utils';

// This query is very similar to the `UniqueQuery`, if you make changes here,
// you probably want to make the same changes there.

export interface WhereQuery<S extends StateDefinition> {
  /**
   * Filter the returned entities by a where clause.
   */
  where(where: Where<S> | null): this;
}

export interface WhereQueryOptions<S extends StateDefinition> {
  where?: Where<S> | null;
}

export type Where<S extends StateDefinition> = StateFind<S> & {
  [K in NonCommonWhereKeys<S>]?: never;
};

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

type NonCommonWhereKeys<S extends StateDefinition> = {
  [K in StateName<S>]: Exclude<
    AllKeys<StateFind<S>>,
    S extends StateDefinition<K> ? AllKeys<StateFind<S>> : never
  >;
}[StateName<S>];
