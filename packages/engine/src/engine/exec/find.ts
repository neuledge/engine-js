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
import { convertFilterQuery, convertUniqueFilterQuery } from '../filter';
import { convertLimitQuery, toLimitedEntityList } from '../limit';
import { convertOffsetQuery } from '../offset';
import { convertRetriveQuery } from '../retrive';
import { convertSortQuery } from '../sort';
import { convertUniqueQuery } from '../unique';

export const execFindMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindManyQueryOptions<S, S>,
): Promise<EntityList<Entity<S>>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  return toLimitedEntityList(
    metadata,
    collection,
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
): Promise<Entity<S> | null> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertUniqueFilterQuery(metadata, collection, options),
    ...convertUniqueQuery(metadata, collection, options),
    limit: 1,
  });

  return toMaybeEntity(metadata, collection, document);
};

export const execFindUniqueOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertUniqueFilterQuery(metadata, collection, options),
    ...convertUniqueQuery(metadata, collection, options),
    limit: 1,
  });

  return toEntityOrThrow(metadata, collection, document);
};

export const execFindFirst = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindFirstQueryOptions<S, S>,
): Promise<Entity<S> | null> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    ...convertOffsetQuery(options),
    limit: 1,
    ...convertSortQuery(collection, options),
  });

  return toMaybeEntity(metadata, collection, document);
};

export const execFindFirstOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindFirstOrThrowQueryOptions<S, S>,
): Promise<Entity<S>> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collectionName: collection.name,
    ...convertRetriveQuery(collection, options),
    ...convertFilterQuery(metadata, collection, options),
    ...convertOffsetQuery(options),
    limit: 1,
    ...convertSortQuery(collection, options),
  });

  return toEntityOrThrow(metadata, collection, document);
};
