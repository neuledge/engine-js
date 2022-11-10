import { Scalar } from '@neuledge/scalars';
import { State } from './state.js';

export type StateScalar<V = unknown> = {
  type: StateScalarType<NonNullable<V>>;
  relation?: never;
  index: number;
  nullable?: boolean;
};

export type StateScalarType<V> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Scalar<V, any, any> | readonly State<string, V>[];
