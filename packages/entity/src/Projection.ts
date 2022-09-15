import { Scalar } from '@neuledge/scalar';
import { ArrayType, State, UnionType } from '@neuledge/state';
import { EntityListOffset } from './List.js';
import { Merge } from './utils.js';

export type Projection<S extends State> = {
  [K in keyof Merge<S['schema']>]?: [
    NonNullable<Merge<S['schema']>[K]>,
  ] extends [{ type: infer T }]
    ? [T] extends [UnionType<State>]
      ? Projection<T[number]> | ProjectionFalse
      : [T] extends [ArrayType<UnionType<State>>]
      ? EntryProjection<Projection<T[0][number]>> | ProjectionFalse
      : [T] extends [ArrayType<Scalar>]
      ? ProjectionPagination | ProjectionFlag
      : ProjectionFlag
    : never;
};

// flags

export type ProjectionFlag = ProjectionTrue | ProjectionFalse;
export type ProjectionTrue = true | 1;
export type ProjectionFalse = false | 0;

// helpers

type EntryProjection<P> = [entry: P, ...rest: ProjectionPagination];

type ProjectionPagination = [limit?: number | null, offset?: EntityListOffset];
