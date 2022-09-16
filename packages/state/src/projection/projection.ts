import { Scalar } from '@neuledge/scalar';
import { ArrayType, UnionType } from '../field.js';
import { EntityListOffset } from '../list.js';
import { State } from '../state/index.js';
import { Merge } from '../utils.js';
import { ProjectionFalse, ProjectionFlag } from './flags.js';

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

// helpers

type EntryProjection<P> = [entry: P, ...rest: ProjectionPagination];

type ProjectionPagination = [limit?: number | null, offset?: EntityListOffset];
