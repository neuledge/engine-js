import {
  StateDefinition,
  StateDefinitionName,
  StateDefinitionFind,
  StateDefinitionUnique,
} from '@/definitions/index.js';
import { AllKeys } from './utils.js';

export type Where<S extends StateDefinition> = StateDefinitionFind<S> & {
  [K in NonCommonQueryKeys<S>]?: never;
};

export type UniqueWhere<S extends StateDefinition> =
  StateDefinitionUnique<S> & {
    [K in NonCommonUniqueKeys<S>]?: never;
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
//   2. Combine result with an OR operator (`category`)
//   3. Forbidden the result from all keys (`id`)

type NonCommonQueryKeys<S extends StateDefinition> = {
  [K in StateDefinitionName<S>]: Exclude<
    AllKeys<StateDefinitionFind<S>>,
    S extends StateDefinition<K> ? AllKeys<StateDefinitionFind<S>> : never
  >;
}[StateDefinitionName<S>];

type NonCommonUniqueKeys<S extends StateDefinition> = {
  [K in StateDefinitionName<S>]: Exclude<
    AllKeys<StateDefinitionUnique<S>>,
    S extends StateDefinition<K> ? AllKeys<StateDefinitionUnique<S>> : never
  >;
}[StateDefinitionName<S>];
