import {
  DeleteMutationDefinition,
  StateDefinition,
  StateDefinitionDeleteMutations,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionUpdateMutations,
  UpdateMutationDefinition,
} from '@/definitions';
import { Entity, MutatedEntity } from '@/entity';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { EntityList } from '@/list';
import { StateDefinitionMap } from './states';

export const updateEntityList = async <
  S extends StateDefinition,
  M extends StateDefinitionUpdateMutations<S>,
  A extends StateDefinitionMutationArguments<S, M>,
>(
  states: StateDefinitionMap<S>,
  entities: EntityList<Entity<S>>,
  method: M,
  args: A,
): Promise<EntityList<Entity<StateDefinitionMutationsReturn<S, M>>>> =>
  Object.assign(
    await Promise.all(
      entities.map((entity) => updateEntity(states, entity, method, args)),
    ),
    { nextOffset: entities.nextOffset },
  );

export const updateEntity = async <
  S extends StateDefinition,
  M extends StateDefinitionUpdateMutations<S>,
  A extends StateDefinitionMutationArguments<S, M>,
>(
  states: StateDefinitionMap<S>,
  entity: Entity<S>,
  method: M,
  args: A,
): Promise<Entity<StateDefinitionMutationsReturn<S, M>>> => {
  const { $state, $version, ...thisArg } = entity as Entity<StateDefinition>;

  const state = states[$state];
  if (!state) {
    throw new NeuledgeError(
      NeuledgeErrorCode.INTERNAL_ERROR,
      `State ${$state} not found`,
    );
  }

  const fn = state[method] as UpdateMutationDefinition<
    S,
    A,
    StateDefinitionMutationsReturn<S, M>
  >;

  const mutated = await fn.call(thisArg, args);

  return {
    ...(mutated as MutatedEntity<StateDefinition>),
    $version: $version + 1,
  };
};

export const deleteEntityList = async <
  S extends StateDefinition,
  M extends StateDefinitionDeleteMutations<S>,
>(
  states: StateDefinitionMap<S>,
  entities: EntityList<Entity<S>>,
  method: M,
): Promise<void> => {
  await Promise.all(
    entities.map((entity) => deleteEntity(states, entity, method)),
  );
};

export const deleteEntity = async <
  S extends StateDefinition,
  M extends StateDefinitionDeleteMutations<S>,
>(
  states: StateDefinitionMap<S>,
  entity: Entity<S>,
  method: M,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $state, $version, ...thisArg } = entity as Entity<StateDefinition>;

  const state = states[$state];
  if (!state) {
    throw new NeuledgeError(
      NeuledgeErrorCode.INTERNAL_ERROR,
      `State ${$state} not found`,
    );
  }

  const fn = state[method] as DeleteMutationDefinition<S>;

  return fn.call(thisArg);
};
