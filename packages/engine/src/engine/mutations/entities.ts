import {
  MutationDefinition,
  StateDefinition,
  StateDefinitionAlterMethods,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
} from '@/definitions';
import { Entity, MutatedEntity } from '@/entity';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import pLimit from 'p-limit';
import { StateDefinitionMap } from './states';

export const alterEntityList = async <
  S extends StateDefinition,
  M extends StateDefinitionAlterMethods<S>,
  A extends StateDefinitionMutationArguments<S, M>,
>(
  states: StateDefinitionMap<S>,
  entities: Entity<S>[],
  method: M,
  args: A,
): Promise<(Entity<StateDefinitionMutationsReturn<S, M>> | null)[]> => {
  const asyncLimit = pLimit(10);

  return Promise.all(
    entities.map((entity) =>
      asyncLimit(() => alterEntity(states, entity, method, args)),
    ),
  );
};

const alterEntity = async <
  S extends StateDefinition,
  M extends StateDefinitionAlterMethods<S>,
  A extends StateDefinitionMutationArguments<S, M>,
>(
  states: StateDefinitionMap<S>,
  entity: Entity<S>,
  method: M,
  args: A,
): Promise<Entity<StateDefinitionMutationsReturn<S, M>> | null> => {
  const { $state, $version, ...thisArg } = entity as Entity<StateDefinition>;

  const state = states[$state];
  if (!state) {
    throw new NeuledgeError(
      NeuledgeErrorCode.INTERNAL_ERROR,
      `State ${$state} not found`,
    );
  }

  const fn = state[method] as
    | MutationDefinition<S, A, StateDefinitionMutationsReturn<S, M>>
    | undefined;

  switch (fn?.mutation) {
    case 'update': {
      const mutated = await fn.call(thisArg, args);

      return {
        ...(mutated as MutatedEntity<StateDefinition>),
        $version: $version + 1,
      };
    }

    case 'delete': {
      await fn.call(thisArg, args);
      return null;
    }

    default: {
      break;
    }
  }

  throw new NeuledgeError(
    NeuledgeErrorCode.INVALID_MUTATION,
    `Mutation ${String(method)} is not an alter mutation`,
  );
};
