import { Projection } from './projection.js';
import { State, StateEntity } from './state.js';

export type Entity<S extends State, P extends S['Projection']> = {
  [K in S['key']]: S extends { key: K } ? EntityProject<S, P> : never;
}[S['key']];

type EntityProject<
  S extends State,
  P extends Projection<InstanceType<S>>,
> = StateEntity<S, Pick<InstanceType<S>, TruthyKeys<InstanceType<S>, P>>>;

type TruthyKeys<T, P extends Projection<T>> = {
  [K in keyof T]: P[K] extends true ? K : never;
}[keyof T];
