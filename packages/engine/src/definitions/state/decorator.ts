import { StateDefinition, StateDefinitionName } from './index';

export const stateDefinitions = new Map<StateDefinitionName, StateDefinition>();

export const State =
  <N extends string, T>() =>
  <S extends StateDefinition<N, T>>(state: S): void => {
    stateDefinitions.set(state.$name, state);
  };
