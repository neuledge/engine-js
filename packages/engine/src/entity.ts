import { State, StateKey } from './generated/index.js';
import { Select } from './queries/select.js';

export type Entity<S extends State> = {
  [K in StateKey<S>]: S extends State<K, infer R> ? StateEntity<S, R> : never;
}[StateKey<S>];

export type ProjectedEntity<S extends State, P extends Select<S>> = {
  [K in StateKey<S>]: S extends State<K, infer R>
    ? Project<S, P & Select<S>, R>
    : never;
}[StateKey<S>];

type StateEntity<S extends State, T> = T & {
  $state: StateKey<S>;
};

type Project<S extends State, P extends Select<S>, T> = StateEntity<
  S,
  {
    [K in TruthyKeys<S, P, T>]: T[K];
  } & {
    [K in BooleanKeys<S, P, T>]?: T[K] | null;
  }
>;

type TruthyKeys<S extends State, P extends Select<S>, T> = {
  [K in keyof T]: P[K] extends true
    ? undefined extends T[K]
      ? never
      : K
    : never;
}[keyof T];

type BooleanKeys<S extends State, P extends Select<S>, T> = {
  [K in keyof T]: P[K] extends false ? never : P[K] extends boolean ? K : never;
}[keyof T];
