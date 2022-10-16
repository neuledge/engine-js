import { Select } from './select.js';
import {
  State,
  StateEntity,
  StateKey,
  StateListSelect,
  StateProjection,
  StateSelect,
} from './state.js';

export type Entity<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in StateKey<S>]: S extends State<K> ? StateEntity<S> : never;
}[StateKey<S>];

export type ProjectedEntity<S extends State, P extends StateSelect<S>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in StateKey<S>]: S extends State<K> ? Project<S, P> : never;
}[StateKey<S>];

type Project<S extends State, P extends StateSelect<S>> = StateEntity<
  S,
  {
    [K in TruthyKeys<StateProjection<S>, P>]: StateProjection<S>[K];
  } & {
    [K in BooleanKeys<StateProjection<S>, P>]?: StateProjection<S>[K] | null;
  } & {
    [K in NestedKeys<
      StateProjection<S>,
      P
    >]: StateProjection<S>[K] extends StateEntity<infer R>[]
      ? P[K] extends StateListSelect<R>
        ? ProjectedEntity<R, P[K]>[]
        : never
      : StateProjection<S>[K] extends StateEntity<infer R>
      ? P[K] extends StateSelect<R>
        ? ProjectedEntity<R, P[K]>
        : never
      : never;
  }
>;

type TruthyKeys<T, P extends Select<T>> = {
  [K in keyof T]: P[K] extends true
    ? undefined extends T[K]
      ? never
      : K
    : never;
}[keyof T];

type BooleanKeys<T, P extends Select<T>> = {
  [K in keyof T]: P[K] extends boolean ? K : never;
}[keyof T];

type NestedKeys<T, P extends Select<T>> = {
  [K in keyof T]: P[K] extends object ? K : never;
}[keyof T];
