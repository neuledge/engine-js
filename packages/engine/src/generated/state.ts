// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface State<K extends string = string, T = any> {
  $key: K;
  $id: { [K in keyof T]?: T[K] };
  $find: { [K in keyof T]?: T[K] };
  $unique: { [K in keyof T]?: T[K] };
  $relations: () => {
    [K in string]: readonly State[] | readonly [readonly State[]];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type StateKey<S extends State> = S['$key'];
export type StateId<S extends State> = S['$id'];
export type StateQuery<S extends State> = S['$find'];
export type StateUnique<S extends State> = S['$unique'];
export type StateRelations<S extends State> = S extends {
  $relations: () => infer R;
}
  ? R
  : never;

export type StateRelation<
  S extends State,
  K extends keyof StateRelations<S>,
> = StateRelations<S>[K] extends readonly State[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly State[]]
  ? StateRelations<S>[K][0][number]
  : never;
