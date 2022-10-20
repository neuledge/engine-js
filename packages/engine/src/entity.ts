import { State, StateKey } from './generated/index.js';
import { Select } from './queries/select.js';

export type Entity<S extends State> = {
  [K in StateKey<S>]: S extends State<K> ? StateEntity<S> : never;
}[StateKey<S>];

export type ProjectedEntity<S extends State, P extends Select<S>> = {
  [K in StateKey<S>]: S extends State<K> ? Project<S, P & Select<S>> : never;
}[StateKey<S>];

type StateEntity<S extends State, T = InstanceType<S>> = {
  $state: StateKey<S>;
  constructor: S;
} & T;

type Project<S extends State, P extends Select<S>> = StateEntity<
  S,
  {
    [K in TruthyKeys<S, P>]: InstanceType<S>[K];
  } & {
    [K in BooleanKeys<S, P>]?: InstanceType<S>[K] | null;
  }
>;

type TruthyKeys<S extends State, P extends Select<S>> = {
  [K in keyof InstanceType<S>]: P[K] extends true
    ? undefined extends InstanceType<S>[K]
      ? never
      : K
    : never;
}[keyof InstanceType<S>];

type BooleanKeys<S extends State, P extends Select<S>> = {
  [K in keyof InstanceType<S>]: P[K] extends false
    ? never
    : P[K] extends boolean
    ? K
    : never;
}[keyof InstanceType<S>];
