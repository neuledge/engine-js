import { Scalar } from '@neuledge/scalars';
import { StateDefinition } from './state.js';

export type StateDefintionScalar<V = unknown> = {
  type: StateDefinitionScalarType<NonNullable<V>>;
  index: number;
  nullable?: boolean;
};

export type StateDefinitionScalarType<V> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Scalar<V, any, any> | readonly StateDefinition<string, V>[];

export const isStateDefinitionScalarTypeScalar = <V>(
  type: StateDefinitionScalarType<V>,
): type is Scalar<V> => !Array.isArray(type);

export const isStateDefinitionScalarTypeStates = <V>(
  type: StateDefinitionScalarType<V>,
): type is readonly StateDefinition<string, V>[] => Array.isArray(type);
