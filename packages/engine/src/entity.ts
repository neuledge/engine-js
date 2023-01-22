import { InitiatedState, StateDefinition, StateName } from './definitions';
import { Select } from './queries';

export type Entity<S extends StateDefinition> = {
  [N in StateName<S>]: S extends StateDefinition<N, infer R>
    ? StateEntity<S, R>
    : never;
}[StateName<S>];

export type InitiatedEntity<S extends StateDefinition> = {
  [N in StateName<S>]: S extends StateDefinition<N, infer R>
    ? InitiatedState<S['$id'], R> & {
        $state: StateName<S>;
      }
    : never;
}[StateName<S>];

export type AlteredEntity<S extends StateDefinition> = {
  [N in StateName<S>]: S extends StateDefinition<N, infer R>
    ? R & { $state: StateName<S> }
    : never;
}[StateName<S>];

export type ProjectedEntity<S extends StateDefinition, P extends Select<S>> = {
  [K in StateName<S>]: S extends StateDefinition<K, infer R>
    ? Project<S, P & Select<S>, R>
    : never;
}[StateName<S>];

type StateEntity<S extends StateDefinition, T> = T & {
  $state: StateName<S>;
  $version: number;
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
