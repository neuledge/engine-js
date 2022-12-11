import {
  CreateMutationDefinition,
  StateDefinition,
  StateDefinitionCreateMutations,
  StateDefinitionMutationArguments,
} from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { EntityList } from '@/list';
import {
  CreateManyQueryOptions,
  CreateOneQueryOptions,
  Select,
} from '@/queries';
import { chooseStatesCollection } from '../collection';
import { toDocuments } from '../document';
import { NeuledgeEngine } from '../engine';
import { projectEntities, projectEntity } from '../entity';

export const execCreateMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: CreateManyQueryOptions<S, S>,
): Promise<
  EntityList<Entity<S>> | EntityList<ProjectedEntity<S, Select<S>>> | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [state] = options.states;
  const fn = state[options.method] as CreateMutationDefinition<
    S,
    StateDefinitionMutationArguments<S, StateDefinitionCreateMutations<S>>
  >;

  const entities: Entity<S>[] = await Promise.all(
    options.args.map((args) => fn(args)),
  );

  await engine.store.insert({
    collectionName: collection.name,
    documents: toDocuments(metadata, entities),
  });

  if (!options.select) {
    return;
  }

  return projectEntities(entities, options.select);
};

export const execCreateOne = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: CreateOneQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [state] = options.states;
  const fn = state[options.method] as CreateMutationDefinition<
    S,
    StateDefinitionMutationArguments<S, StateDefinitionCreateMutations<S>>
  >;

  const [args] = options.args;
  const entity: Entity<S> = await fn(args);

  await engine.store.insert({
    collectionName: collection.name,
    documents: toDocuments(metadata, [entity]),
  });

  if (!options.select) {
    return;
  }

  return projectEntity(entity, options.select);
};
