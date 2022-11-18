import { StateDefinition, StateDefinitionName } from './index.js';

export const stateDefinitions = new Map<StateDefinitionName, StateDefinition>();

export const State = (state: StateDefinition): void => {
  stateDefinitions.set(state.$name, state);
};
