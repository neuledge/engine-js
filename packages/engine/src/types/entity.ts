import { Projection } from './projection.js';
import { State, StateEntity, StateKey, StateProjection } from './state.js';

export type Entity<S extends State, P extends StateProjection<S>> = {
  [K in StateKey<S>]: S extends State<object, K> ? EntityProject<S, P> : never;
}[StateKey<S>];

type EntityProject<
  S extends State,
  P extends Projection<InstanceType<S>>,
> = StateEntity<S, Pick<InstanceType<S>, TruthyKeys<InstanceType<S>, P>>>;

type TruthyKeys<T, P extends Projection<T>> = {
  [K in keyof T]: P[K] extends true ? K : never;
}[keyof T];
