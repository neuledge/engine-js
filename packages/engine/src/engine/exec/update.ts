import {
  StateDefinition,
  StateDefinitionMutationsReturn,
  StateDefinitionUpdateMutations,
} from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { EntityList } from '@/list';
import {
  Select,
  UpdateFirstOrThrowQueryOptions,
  UpdateFirstQueryOptions,
  UpdateManyQueryOptions,
  UpdateUniqueOrThrowQueryOptions,
  UpdateUniqueQueryOptions,
} from '@/queries';
import { chooseStatesCollection } from '../collection';
import { toDocuments } from '../document';
import { NeuledgeEngine } from '../engine';
import {
  projectEntities,
  projectEntity,
  toEntityOrThrow,
  toMaybeEntity,
} from '../entity';
import { convertFilterQuery } from '../filter';
import { convertLimitQuery, toLimitedEntityList } from '../limit';
import { convertRetriveQuery } from '../retrive';
import {
  updateEntity,
  updateEntityList,
  updateStoreDocuments,
} from '../mutations/index';

type ReturnState<S extends StateDefinition> = StateDefinitionMutationsReturn<
  S,
  StateDefinitionUpdateMutations<S>
>;

export const execUpdateMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: UpdateManyQueryOptions<S, ReturnState<S>>,
): Promise<
  | EntityList<Entity<ReturnState<S>>>
  | EntityList<ProjectedEntity<ReturnState<S>, Select<ReturnState<S>>>>
  | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const documents = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    ...convertLimitQuery(options),
  });

  const entities = toLimitedEntityList(metadata, options, documents);

  const [args] = options.args;
  const updated = await updateEntityList(
    options.states,
    entities,
    options.method,
    args,
  );

  await updateStoreDocuments(
    engine.store,
    collection,
    documents,
    toDocuments(metadata, updated),
  );

  if (!options.select) {
    return;
  }

  return projectEntities(updated, options.select);
};

export const execUpdateMaybeEntity = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options:
    | UpdateFirstQueryOptions<S, ReturnState<S>>
    | UpdateUniqueQueryOptions<S, ReturnState<S>>,
): Promise<
  | Entity<ReturnState<S>>
  | ProjectedEntity<ReturnState<S>, Select<ReturnState<S>>>
  | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const documents = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    limit: 1,
  });

  const entity = toMaybeEntity(metadata, documents);
  if (!entity) return;

  const [args] = options.args;
  const updated: Entity<ReturnState<S>> = await updateEntity(
    options.states,
    entity,
    options.method,
    args,
  );

  await updateStoreDocuments(
    engine.store,
    collection,
    documents,
    toDocuments(metadata, [updated]),
  );

  if (!options.select) {
    return;
  }

  return projectEntity(updated, options.select);
};

export const execUpdateEntityOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options:
    | UpdateFirstOrThrowQueryOptions<S, ReturnState<S>>
    | UpdateUniqueOrThrowQueryOptions<S, ReturnState<S>>,
): Promise<
  | Entity<ReturnState<S>>
  | ProjectedEntity<ReturnState<S>, Select<ReturnState<S>>>
  | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const documents = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    limit: 1,
  });

  const entity = toEntityOrThrow(metadata, documents);

  const [args] = options.args;
  const updated: Entity<ReturnState<S>> = await updateEntity(
    options.states,
    entity,
    options.method,
    args,
  );

  await updateStoreDocuments(
    engine.store,
    collection,
    documents,
    toDocuments(metadata, [updated]),
  );

  if (!options.select) {
    return;
  }

  return projectEntity(updated, options.select);
};
