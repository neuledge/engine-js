import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { neuledgeGlob } from '@/glob';
import { StateDefinition } from './state';

const { stateDefinitions } = neuledgeGlob;

export const State =
  <N extends string, T>() =>
  <S extends StateDefinition<N, T>>(state: S): void => {
    if (
      stateDefinitions.has(state.$name) &&
      stateDefinitions.get(state.$name) !== state
    ) {
      throw new NeuledgeError(
        NeuledgeErrorCode.DUPLICATE_STATE_NAME,
        `State "${state.$name}" is already defined.`,
      );
    }

    stateDefinitions.set(state.$name, state);
  };
