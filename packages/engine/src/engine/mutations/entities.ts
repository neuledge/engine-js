import {
  DeleteMutationDefinition,
  StateDefinition,
  StateDefinitionDeleteMutations,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionUpdateMutations,
  UpdateMutationDefinition,
} from '@/definitions';
import { Entity } from '@/entity';
import { EntityList } from '@/list';

export const updateEntityList = async <
  S extends StateDefinition,
  M extends StateDefinitionUpdateMutations<S>,
  A extends StateDefinitionMutationArguments<S, M>,
>(
  states: S[],
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
  states: S[],
  entity: Entity<S>,
  method: M,
  args: A,
): Promise<Entity<StateDefinitionMutationsReturn<S, M>>> => {
  const { $state, ...thisArg } = entity as Entity<StateDefinition>;

  const state = states.find((state) => state.$name === $state);
  if (!state) {
    throw new Error(`State ${$state} not found`);
  }

  const fn = state[method] as UpdateMutationDefinition<
    S,
    A,
    StateDefinitionMutationsReturn<S, M>
  >;

  return fn.call(thisArg, args);
};

export const deleteEntityList = async <
  S extends StateDefinition,
  M extends StateDefinitionDeleteMutations<S>,
>(
  states: S[],
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
  states: S[],
  entity: Entity<S>,
  method: M,
): Promise<void> => {
  const { $state, ...thisArg } = entity as Entity<StateDefinition>;

  const state = states.find((state) => state.$name === $state);
  if (!state) {
    throw new Error(`State ${$state} not found`);
  }

  const fn = state[method] as DeleteMutationDefinition<S>;

  return fn.call(thisArg);
};
