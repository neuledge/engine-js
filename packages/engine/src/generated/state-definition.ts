import { State, StateKey } from './state.js';

export const stateDefinitions = new Map<StateKey, State>();

export const StateDefinition = (state: State): void => {
  stateDefinitions.set(state.$key, state);
};
