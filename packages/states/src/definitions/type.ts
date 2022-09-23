import { StateDefinition } from './state.js';
import { ScalarDefinition } from './scalar.js';
import { EitherDefinition } from './either.js';

export type TypeDefinition =
  | StateTypeDefinition
  | ScalarTypeDefinition
  | EitherTypeDefinition;

export interface StateTypeDefinition {
  type: 'State';
  state: StateDefinition;
}

export interface ScalarTypeDefinition {
  type: 'Scalar';
  scalar: ScalarDefinition;
}

export interface EitherTypeDefinition {
  type: 'Either';
  either: EitherDefinition;
}
