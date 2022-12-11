import { StateDefinition } from '@/definitions';
import { Entity } from '@/entity';
import { EntityList } from '@/list';
import {
  FindFirstOrThrowQueryOptions,
  FindFirstQueryOptions,
  FindManyQueryOptions,
  FindUniqueOrThrowQueryOptions,
  FindUniqueQueryOptions,
} from '@/queries';
import { chooseStatesCollection } from '../collection';
import { NeuledgeEngine } from '../engine';
import { toEntityOrThrow, toMaybeEntity } from '../entity';
import { convertFilterQuery } from '../filter/index';
import { convertLimitQuery, toLimitedEntityList } from '../limit';
import { convertOffsetQuery } from '../offset';
import { convertRetriveQuery } from '../retrive/index';
import { convertSortQuery } from '../sort';

export const execFindMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindManyQueryOptions<S, S>,
): Promise<EntityList<Entity<S>>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toLimitedEntityList(
    metadata,
    options,
    await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      ...convertOffsetQuery(options),
      ...convertLimitQuery(options),
      ...convertSortQuery(collection, options),
    }),
  );
};

export const execFindUnique = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindUniqueQueryOptions<S, S>,
): Promise<Entity<S> | undefined> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toMaybeEntity(
    metadata,
    await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      limit: 1,
    }),
  );
};

export const execFindUniqueOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toEntityOrThrow(
    metadata,
    await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      limit: 1,
    }),
  );
};

export const execFindFirst = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindFirstQueryOptions<S, S>,
): Promise<Entity<S> | undefined> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toMaybeEntity(
    metadata,
    await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      ...convertOffsetQuery(options),
      limit: 1,
      ...convertSortQuery(collection, options),
    }),
  );
};

export const execFindFirstOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindFirstOrThrowQueryOptions<S, S>,
): Promise<Entity<S>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toEntityOrThrow(
    metadata,
    await engine.store.find({
      collectionName: collection.name,
      ...convertRetriveQuery(collection, options),
      ...convertFilterQuery(metadata, collection, options),
      ...convertOffsetQuery(options),
      limit: 1,
      ...convertSortQuery(collection, options),
    }),
  );
};
