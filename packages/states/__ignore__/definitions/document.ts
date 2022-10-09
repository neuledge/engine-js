import { EitherDefinition } from './either.js';
import { ScalarDefinition } from './scalar.js';
import { StateDefinition } from './state.js';

export interface DocumentDefinition {
  scalars: Record<ScalarDefinition['name'], ScalarDefinition>;
  states: Record<StateDefinition['name'], StateDefinition[]>;
  eithers: Record<EitherDefinition['name'], EitherDefinition>;
}
