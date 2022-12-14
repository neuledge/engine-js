import { StateDefinition } from '@/definitions';

export type StateDefinitionMap<S extends StateDefinition> = {
  [N in string]?: S;
};

export const getStateDefinitionMap = <S extends StateDefinition>(
  states: S[],
): StateDefinitionMap<S> => {
  const map: StateDefinitionMap<S> = {};

  for (const state of states) {
    map[state.$name] = state;
  }

  return map;
};
