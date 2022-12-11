import { StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { EntityList } from '@/list';
import {
  DeleteFirstOrThrowQueryOptions,
  DeleteFirstQueryOptions,
  DeleteManyQueryOptions,
  DeleteUniqueOrThrowQueryOptions,
  DeleteUniqueQueryOptions,
  Select,
} from '@/queries';
import { chooseStatesCollection } from '../collection';
import { NeuledgeEngine } from '../engine';
import { projectEntity, toEntityOrThrow, toMaybeEntity } from '../entity';
import { convertFilterQuery } from '../filter';
import { convertLimitQuery, toLimitedEntityList } from '../limit';
import {
  deleteEntity,
  deleteEntityList,
  deleteStoreDocuments,
} from '../mutations';
import { convertRetriveQuery } from '../retrive';

export const execDeleteMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: DeleteManyQueryOptions<S, S>,
): Promise<
  EntityList<Entity<S>> | EntityList<ProjectedEntity<S, Select<S>>> | void
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

  await deleteEntityList(options.states, entities, options.method);
  await deleteStoreDocuments(engine.store, collection, documents);

  if (!options.select) {
    return;
  }

  return projectEntity(entities, options.select);
};

export const execDeleteMaybeEntity = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: DeleteFirstQueryOptions<S, S> | DeleteUniqueQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
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

  await deleteEntity(options.states, entity, options.method);
  await deleteStoreDocuments(engine.store, collection, documents);

  if (!options.select) {
    return;
  }

  return projectEntity(entity, options.select);
};

export const execDeleteEntityOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options:
    | DeleteFirstOrThrowQueryOptions<S, S>
    | DeleteUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const documents = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    limit: 1,
  });

  const entity = toEntityOrThrow(metadata, documents);
  if (!entity) return;

  await deleteEntity(options.states, entity, options.method);
  await deleteStoreDocuments(engine.store, collection, documents);

  if (!options.select) {
    return;
  }

  return projectEntity(entity, options.select);
};
