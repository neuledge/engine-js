import { Scalar } from '@neuledge/scalars';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any> {
  $key: K;
  $scalars: Defer<{
    [K in keyof T]: T[K] extends undefined | null
      ? { type: StateScalarType<NonNullable<T[K]>>; nullable: true }
      : { type: StateScalarType<T[K]>; nullable?: false };
  }>;
  $id: { [K in keyof T]?: T[K] };
  $find: { [K in keyof T]?: T[K] };
  $unique: { [K in keyof T]?: T[K] };
  $relations?: Defer<{
    [K in string]: readonly State[] | readonly [readonly State[]];
  }>;
  $indexes?: { [K in string]: (keyof T)[] };
  $methods?: Defer<{ [K in string]?: readonly State[] }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StateScalarType<T> = Scalar<T, any, any> | State<string, T>[];

export type Defer<T> = (() => T) | T;
type Deferred<T> = T extends Defer<infer R> ? R : Record<never, never>;

export type StateKey<S extends State> = S['$key'];
export type StateScalars<S extends State> = Deferred<S['$scalars']>;
export type StateId<S extends State> = S['$id'];
export type StateQuery<S extends State> = S['$find'];
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
