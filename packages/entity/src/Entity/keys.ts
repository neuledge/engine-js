import {
  Projection,
  ProjectionFalse,
  ProjectionTrue,
  State,
  StateSchema,
} from '@neuledge/state';

export type ProjectionRequiredKeys<
  P extends Projection<S>,
  S extends State<string, StateSchema>,
> = Exclude<
  {
    [K in keyof S['schema']]: [S['schema'][K]['nullable']] extends [true]
      ? never
      : [P[K]] extends [ProjectionTrue | object]
      ? K
      : never;
  }[keyof S['schema']],
  undefined
>;

export type ProjectionNullableKeys<
  P extends Projection<S>,
  S extends State<string, StateSchema>,
> = Exclude<
  {
    [K in keyof S['schema']]: [P[K]] extends [number | boolean | object]
      ? [P[K]] extends [ProjectionFalse]
        ? never
        : K
      : never;
  }[keyof S['schema']],
  undefined
>;

export type RequiredKeys<S extends State<string, StateSchema>> = Exclude<
  {
    [K in keyof S['schema']]: [S['schema'][K]['nullable']] extends [true]
      ? never
      : K;
  }[keyof S['schema']],
  undefined
>;

export type NullableKeys<S extends State<string, StateSchema>> = Exclude<
  {
    [K in keyof S['schema']]: [S['schema'][K]['nullable']] extends [true]
      ? K
      : never;
  }[keyof S['schema']],
  undefined
>;
