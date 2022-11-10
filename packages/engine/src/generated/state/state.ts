import { StateScalar } from './scalar.js';
import { SortDefinition } from './sort.js';
import { StateWhere } from './where.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any> {
  $key: K;
  $id: readonly (keyof T)[];
  $scalars: Defer<{ [K in keyof T]: StateScalar<T[K]> }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $find: StateWhere<any>;
  $unique: { [K in keyof T]?: T[K] };
  $relations?: Defer<
    Record<string, readonly State[] | readonly [readonly State[]]>
  >;
  $states?: Defer<readonly State[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $indexes?: Record<string, SortDefinition<any>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type Defer<T> = (() => T) | T;
type Deferred<T> = T extends Defer<infer R> ? R : Record<never, never>;

export type StateType<S extends State> = S extends State<string, infer R>
  ? R
  : never;

export type StateKey<S extends State = State> = S['$key'];
// export type StateScalars<S extends State> = Deferred<S['$scalars']>;
export type StateId<S extends State> = Pick<StateType<S>, S['$id'][number]>;
export type StateFind<S extends State> = S['$find'];
export type StateUnique<S extends State> = S['$unique'];
export type StateIndexes<S extends State> = NonNullable<S['$indexes']>;
export type StateRelations<S extends State> = Deferred<S['$relations']>;
// export type StateStates<S extends State> = Deferred<S['$states']>;

export const resolveDefer: {
  <T>(defer: Defer<T>): T;
  <T>(defer: Defer<T> | undefined | null, def: T): T;
} = <T>(defer: Defer<T> | undefined | null, def?: T): T => {
  if (typeof defer === 'function') {
    return (defer as () => T)();
  }

  return defer ?? (def as T);
};
