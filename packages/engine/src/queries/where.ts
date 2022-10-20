import { State, StateKey, StateQuery, StateUnique } from '@/generated/index.js';
import { AllKeys } from './utils.js';

export type Where<S extends State> = StateQuery<S> & {
  [K in ForbiddenQueryKeys<S>]?: never;
};

export type UniqueWhere<S extends State> = StateUnique<S> & {
  [K in ForbiddenUniqueKeys<S>]?: never;
};

// Forbidden all non-common keys between the given states, effectively doing an
// AND operator between all state values.
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
//   2. Combine result with and OR operator (`category`)
//   3. Forbidden the result from all keys (`id`)

type ForbiddenQueryKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateQuery<S>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    S extends State<K> ? AllKeys<StateQuery<S>> : never
  >;
}[StateKey<S>];

type ForbiddenUniqueKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateUnique<S>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    S extends State<K> ? AllKeys<StateUnique<S>> : never
  >;
}[StateKey<S>];
