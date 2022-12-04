import { StateDefinition, StateDefinitionName } from './index';

export const stateDefinitions = new Map<StateDefinitionName, StateDefinition>();

export const State = (state: StateDefinition): void => {
  stateDefinitions.set(state.$name, state);
};
