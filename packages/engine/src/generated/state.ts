// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any> {
  $key: K;
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

type Defer<T> = (() => T) | T;

export type StateKey<S extends State> = S['$key'];
export type StateId<S extends State> = S['$id'];
export type StateQuery<S extends State> = S['$find'];
export type StateUnique<S extends State> = S['$unique'];
export type StateIndexes<S extends State> = NonNullable<S['$indexes']>;
export type StateRelations<S extends State> = S extends {
  $relations: Defer<infer R>;
}
  ? R
  : Record<never, never>;
export type StateMethods<S extends State> = S extends {
  $methods: Defer<infer R>;
}
  ? R
  : Record<never, never>;
