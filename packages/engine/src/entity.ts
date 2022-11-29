import { StateDefinition, StateDefinitionName } from './definitions/index.js';
import { Select } from './queries/index.js';

export type Entity<S extends StateDefinition> = {
  [N in StateDefinitionName<S>]: S extends StateDefinition<N, infer R>
    ? StateEntity<S, R>
    : never;
}[StateDefinitionName<S>];

export type ProjectedEntity<S extends StateDefinition, P extends Select<S>> = {
  [K in StateDefinitionName<S>]: S extends StateDefinition<K, infer R>
    ? Project<S, P & Select<S>, R>
    : never;
}[StateDefinitionName<S>];

type StateEntity<S extends StateDefinition, T> = T & {
  $state: StateDefinitionName<S>;
};

type Project<S extends StateDefinition, P extends Select<S>, T> = StateEntity<
  S,
  {
    [K in TruthyKeys<S, P, T>]: T[K];
  } & {
    [K in BooleanKeys<S, P, T>]?: T[K] | null;
  }
>;

type TruthyKeys<S extends StateDefinition, P extends Select<S>, T> = {
  [K in keyof T]: P[K] extends true
    ? undefined extends T[K]
      ? never
      : K
    : never;
}[keyof T];

type BooleanKeys<S extends StateDefinition, P extends Select<S>, T> = {
  [K in keyof T]: P[K] extends false ? never : P[K] extends boolean ? K : never;
}[keyof T];
