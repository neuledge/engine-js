import { Scalar } from '@neuledge/scalars';
import { StateDefinition } from './state';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateDefintionScalar<V = any> = {
  type: StateDefinitionScalarType<NonNullable<V>>;
  index: number;
  nullable?: boolean;
};

export type StateDefinitionScalarType<V> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Scalar<V, any, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | readonly StateDefinition<string, V & { [key: string]: any }>[];

export const isStateDefinitionScalarTypeScalar = <V>(
  type: StateDefinitionScalarType<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): type is Scalar<V, any, any> => !Array.isArray(type);

export const isStateDefinitionScalarTypeStates = <V>(
  type: StateDefinitionScalarType<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): type is readonly StateDefinition<string, V & { [key: string]: any }>[] =>
  Array.isArray(type);
