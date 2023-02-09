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
import { toEntityList, toEntityOrThrow, toMaybeEntity } from '../entity';
import { convertUniqueQuery, convertWhereQuery } from '../filter';
import {
  convertLimitQuery,
  checkLimitedList,
  convertOffsetQuery,
  convertSortQuery,
} from '../pagination';
import {
  convertExpandQuery,
  convertPopulateQuery,
  convertSelectQuery,
} from '../retrieve';

export const execFindMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindManyQueryOptions<S, S>,
): Promise<EntityList<Entity<S>>> => {
  const metadata = await engine.metadata;

  const { states, collection } = chooseStatesCollection(
    metadata,
    options.states,
  );

  const list = checkLimitedList(
    options,
    await engine.store.find({
      collection,
      ...convertSelectQuery(collection, options),
      ...convertExpandQuery(metadata, collection, options),
      ...convertPopulateQuery(metadata, collection, options),
      ...convertWhereQuery(states, collection, options),
      ...convertOffsetQuery(options),
      ...convertLimitQuery(options),
      ...convertSortQuery(collection, options),
    }),
  );

  return toEntityList(metadata, collection, list);
};

export const execFindUnique = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindUniqueQueryOptions<S, S>,
): Promise<Entity<S> | null> => {
  const metadata = await engine.metadata;
  const { collection } = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collection,
    ...convertSelectQuery(collection, options),
    ...convertExpandQuery(metadata, collection, options),
    ...convertPopulateQuery(metadata, collection, options),
    ...convertUniqueQuery(collection, options),
    limit: 1,
  });

  return toMaybeEntity(metadata, collection, document);
};

export const execFindUniqueOrThrow = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindUniqueOrThrowQueryOptions<S, S>,
): Promise<Entity<S>> => {
  const metadata = await engine.metadata;
  const { collection } = chooseStatesCollection(metadata, options.states);

  const [document] = await engine.store.find({
    collection,
    ...convertSelectQuery(collection, options),
    ...convertExpandQuery(metadata, collection, options),
    ...convertPopulateQuery(metadata, collection, options),
    ...convertUniqueQuery(collection, options),
    limit: 1,
  });

  return toEntityOrThrow(metadata, collection, document);
};

export const execFindFirst = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: FindFirstQueryOptions<S, S>,
): Promise<Entity<S> | null> => {
  const metadata = await engine.metadata;

  const { states, collection } = chooseStatesCollection(
    metadata,
    options.states,
  );

  const [document] = await engine.store.find({
    collection,
    ...convertSelectQuery(collection, options),
    ...convertExpandQuery(metadata, collection, options),
    ...convertPopulateQuery(metadata, collection, options),
    ...convertWhereQuery(states, collection, options),
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

  const { states, collection } = chooseStatesCollection(
    metadata,
    options.states,
  );

  const [document] = await engine.store.find({
    collection,
    ...convertSelectQuery(collection, options),
    ...convertExpandQuery(metadata, collection, options),
    ...convertPopulateQuery(metadata, collection, options),
    ...convertWhereQuery(states, collection, options),
    ...convertOffsetQuery(options),
    limit: 1,
    ...convertSortQuery(collection, options),
  });

  return toEntityOrThrow(metadata, collection, document);
};
