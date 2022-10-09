import { NamedDefinition } from './named.js';
import { StateDefinition } from './state.js';

export interface EitherDefinition extends NamedDefinition {
  states: StateDefinition;
}
