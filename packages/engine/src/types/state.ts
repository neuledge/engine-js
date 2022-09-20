import { Projection } from './projection.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<T = any> {
  key: string;
  Query: { [K in keyof T]?: T[K] };
  UniqueQuery: { [K in keyof T]?: T[K] };
  Projection: Projection<T>;

  new (): T;
}

export type StateEntity<S extends State, T = InstanceType<S>> = {
  $state: S['key'];
  constructor: S;
} & T;
