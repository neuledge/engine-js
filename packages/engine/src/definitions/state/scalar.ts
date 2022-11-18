import { Scalar } from '@neuledge/scalars';
import { StateDefinition } from './state.js';

export type StateDefintionScalar<V = unknown> = {
  type: StateDefinitionScalarType<NonNullable<V>>;
  relation?: never;
  index: number;
  nullable?: boolean;
};

export type StateDefinitionScalarType<V> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Scalar<V, any, any> | readonly StateDefinition<string, V>[];
