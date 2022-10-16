import { ListSelect, Select } from './select.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any, P = any> {
  $key: K;
  $id: { [K in keyof T]?: T[K] };
  $find: { [K in keyof T]?: T[K] };
  $unique: { [K in keyof T]?: T[K] };
  $projection: P;
  $select: Select<P>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type StateKey<S extends State> = S['$key'];
export type StateId<S extends State> = S['$id'];
export type StateProjection<S extends State> = S['$projection'];
export type StateSelect<S extends State> = S['$select'];
export type StateUniqueQuery<S extends State> = S['$unique'];
export type StateQuery<S extends State> = S['$find'];

export type StateEntity<S extends State, T = InstanceType<S>> = {
  $state: StateKey<S>;
  constructor: S;
} & T;

export type StateListSelect<S extends State> = ListSelect<StateSelect<S>>;
