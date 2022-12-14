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
import { toDocument, toDocuments } from '../document';
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
  getStateDefinitionMap,
  updateEntity,
  updateEntityList,
  updateStoreDocument,
  updateStoreDocuments,
} from '../mutations';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';

const UPDATE_VERSION_RETRIES = 3;

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

  const entities = toLimitedEntityList(
    metadata,
    collection,
    options,
    documents,
  );

  const states = getStateDefinitionMap(options.states);
  const [args] = options.args;

  const updated = await updateEntityList(
    states,
    entities,
    options.method,
    args,
  );

  const success = await updateStoreDocuments(
    engine.store,
    collection,
    documents,
    toDocuments(metadata, collection, updated),
  );

  const res = Object.assign(
    updated.filter((_, index) => success[index]),
    { nextOffset: updated.nextOffset },
  );

  // TODO we better want to check for version mismatch here and retry only
  // for the affected entities. This is a bit tricky because we need to
  // decide what to do if the retry fails again. We could either throw
  // an error or return the entities that were updated successfully and omit
  // the entities that failed to update. The latter is probably the better.

  if (!options.select) {
    return;
  }

  return projectEntities(res, options.select);
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

  for (let retries = 1; retries < UPDATE_VERSION_RETRIES; retries++) {
    const [document] = await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      limit: 1,
    });

    const entity = toMaybeEntity(metadata, collection, document);
    if (!entity) return;

    const states = getStateDefinitionMap(options.states);
    const [args] = options.args;

    const updated: Entity<ReturnState<S>> = await updateEntity(
      states,
      entity,
      options.method,
      args,
    );

    const success = await updateStoreDocument(
      engine.store,
      collection,
      document,
      toDocument(metadata, collection, updated),
    );
    if (!success) continue;

    if (!options.select) {
      return;
    }

    return projectEntity(updated, options.select);
  }

  throw new NeuledgeError(
    NeuledgeErrorCode.VERSION_MISMATCH,
    'Version mismatch while updating entity',
  );
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

  for (let retries = 1; retries < UPDATE_VERSION_RETRIES; retries++) {
    const [document] = await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      limit: 1,
    });

    const entity = toEntityOrThrow(metadata, collection, document);
    const states = getStateDefinitionMap(options.states);

    const [args] = options.args;
    const updated: Entity<ReturnState<S>> = await updateEntity(
      states,
      entity,
      options.method,
      args,
    );

    const success = await updateStoreDocument(
      engine.store,
      collection,
      document,
      toDocument(metadata, collection, updated),
    );
    if (!success) continue;

    if (!options.select) {
      return;
    }

    return projectEntity(updated, options.select);
  }

  throw new NeuledgeError(
    NeuledgeErrorCode.VERSION_MISMATCH,
    'Version mismatch while updating entity',
  );
};
