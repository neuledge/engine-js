import { State } from '@/state/index.js';
import { ProjectionFalse, ProjectionTrue } from './flags.js';
import { Projection } from './projection.js';

export type ProjectionRequiredKeys<
  P extends Projection<S>,
  S extends State,
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
  S extends State,
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
