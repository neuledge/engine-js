import { Scalar } from '@neuledge/scalars';
import { StateWhere } from './state-where.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any> {
  $key: K;
  $scalars: Defer<{
    [K in keyof T]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Scalar<T[K], any, any>;
      index: number;
      nullable?: boolean;
      relation?: readonly State<string, T[K]>[];
    };
  }>;
  $id: { [K in keyof T]?: T[K] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $find: StateWhere<any>;
  $unique: { [K in keyof T]?: T[K] };
  $relations?: Defer<{
    [K in string]: readonly State[] | readonly [readonly State[]];
  }>;
  $indexes?: { [K in string]: (keyof T)[] };
  $methods?: Defer<{ [K in string]?: readonly State[] }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type Defer<T> = (() => T) | T;
type Deferred<T> = T extends Defer<infer R> ? R : Record<never, never>;

export type StateKey<S extends State = State> = S['$key'];
export type StateScalars<S extends State> = Deferred<S['$scalars']>;
export type StateId<S extends State> = S['$id'];
export type StateFind<S extends State> = S['$find'];
export type StateUnique<S extends State> = S['$unique'];
export type StateIndexes<S extends State> = NonNullable<S['$indexes']>;
export type StateRelations<S extends State> = Deferred<S['$relations']>;
export type StateMethods<S extends State> = Deferred<S['$methods']>;

export const resolveDefer: {
  <T>(defer: Defer<T>): T;
  <T>(defer: Defer<T> | undefined | null, def: T): T;
} = <T>(defer: Defer<T> | undefined | null, def?: T): T => {
  if (typeof defer === 'function') {
    return (defer as () => T)();
  }

  return defer ?? (def as T);
};
