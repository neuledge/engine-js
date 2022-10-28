import { State } from './state.js';

export const stateDefinitions = new Set<State>();

export const StateDefinition = (state: State): void => {
  stateDefinitions.add(state);
};
