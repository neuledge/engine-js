import { Projection } from './projection.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<T = any, K extends string = string> {
  $key: K;
  $query: { [K in keyof T]?: T[K] };
  $uniqueQuery: { [K in keyof T]?: T[K] };
  $projection: Projection<T>;

  new (): T;
}

export type StateKey<S extends State> = S['$key'];
export type StateProjection<S extends State> = S['$projection'];
export type StateUniqueQuery<S extends State> = S['$uniqueQuery'];
export type StateQuery<S extends State> = S['$query'];

export type StateEntity<S extends State, T = InstanceType<S>> = {
  $state: StateKey<S>;
  constructor: S;
} & T;
