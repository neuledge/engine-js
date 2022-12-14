import { StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { EntityList } from '@/list';
import { MetadataCollection } from '@/metadata/collection';
import {
  DeleteFirstOrThrowQueryOptions,
  DeleteFirstQueryOptions,
  DeleteManyQueryOptions,
  DeleteUniqueOrThrowQueryOptions,
  DeleteUniqueQueryOptions,
  Select,
} from '@/queries';
import { StoreDocument, StoreList } from '@/store';
import { chooseStatesCollection } from '../collection';
import { NeuledgeEngine } from '../engine';
import {
  projectEntities,
  projectEntity,
  toEntityOrThrow,
  toMaybeEntity,
} from '../entity';
import { convertFilterQuery } from '../filter';
import {
  convertLimitQuery,
  DEFAULT_QUERY_LIMIT,
  toLimitedEntityList,
} from '../limit';
import {
  deleteEntity,
  deleteEntityList,
  deleteStoreDocuments,
} from '../mutations';
import { getStateDefinitionMap } from '../mutations/states';
import { convertRetriveQuery } from '../retrive';

export const execDeleteMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: DeleteManyQueryOptions<S, S>,
): Promise<
  EntityList<Entity<S>> | EntityList<ProjectedEntity<S, Select<S>>> | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  if (!options.select && (await tryDeleteStates(options))) {
    let res;

    do {
      res = await engine.store.delete({
        collectionName: collection.name,
        ...convertFilterQuery(metadata, collection, options),
        ...convertLimitQuery(options),
      });
    } while (options.limit == null && res.affectedCount >= DEFAULT_QUERY_LIMIT);

    return;
  }

  const documents = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    ...convertLimitQuery(options),
  });

  const entities = toLimitedEntityList(
    metadata,
    collection,
    options,
    documents,
  );

  return deleteMany(engine, collection, entities, documents, options);
};

export const execDeleteMaybeEntity = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: DeleteFirstQueryOptions<S, S> | DeleteUniqueQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    limit: 1,
  });

  const entity = toMaybeEntity(metadata, collection, document);
  if (!entity) return;

  return deleteOne(engine, collection, entity, document, options);
};

export const execDeleteEntityOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options:
    | DeleteFirstOrThrowQueryOptions<S, S>
    | DeleteUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    limit: 1,
  });

  const entity = toEntityOrThrow(metadata, collection, document);
  if (!entity) return;

  return deleteOne(engine, collection, entity, document, options);
};

// delete helpers

const tryDeleteStates = async <S extends StateDefinition>(
  options: DeleteManyQueryOptions<S, S>,
) => {
  const entities = options.states.map(
    (state): Entity<StateDefinition> => ({
      $state: state.$name,
      $version: 0,
    }),
  );

  const states = getStateDefinitionMap(options.states);

  try {
    await deleteEntityList(states, entities, options.method);
    return true;
  } catch {
    return false;
  }
};

const deleteMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  collection: MetadataCollection,
  entities: EntityList<Entity<S>>,
  documents: StoreList<StoreDocument>,
  options: DeleteManyQueryOptions<S, S>,
): Promise<EntityList<Entity<S> | ProjectedEntity<S, Select<S>>> | void> => {
  const states = getStateDefinitionMap(options.states);

  await deleteEntityList(states, entities, options.method);
  await deleteStoreDocuments(engine.store, collection, documents);

  if (!options.select) {
    return;
  }

  return projectEntities(entities, options.select);
};

const deleteOne = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  collection: MetadataCollection,
  entity: Entity<S>,
  document: StoreDocument,
  options:
    | DeleteFirstQueryOptions<S, S>
    | DeleteUniqueQueryOptions<S, S>
    | DeleteFirstOrThrowQueryOptions<S, S>
    | DeleteUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const states = getStateDefinitionMap(options.states);

  await deleteEntity(states, entity, options.method);
  await deleteStoreDocuments(engine.store, collection, [document]);

  if (!options.select) {
    return;
  }

  return projectEntity(entity, options.select);
};
