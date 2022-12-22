import {
  MutationDefinition,
  StateDefinition,
  StateDefinitionAlterMethods,
  StateDefinitionMutationsReturn,
} from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import {
  Select,
  AlterFirstOrThrowQueryOptions,
  AlterFirstQueryOptions,
  AlterManyQueryOptions,
  AlterUniqueOrThrowQueryOptions,
  AlterUniqueQueryOptions,
} from '@/queries';
import { chooseStatesCollection } from '../collection';
import { NeuledgeEngine } from '../engine';
import {
  projectEntities,
  toEntityList,
  toEntityListOrThrow,
  UpdatedEntity,
} from '../entity';
import { convertFilterQuery, convertUniqueFilterQuery } from '../filter';
import {
  convertLimitQuery,
  DEFAULT_QUERY_LIMIT,
  checkLimitedList,
} from '../limit';
import {
  getStateDefinitionMap,
  StateDefinitionMap,
  alterEntityList,
  alterStoreDocuments,
} from '../mutations';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { convertUniqueQuery } from '../unique';
import {
  Store,
  StoreDeleteOptions,
  StoreDocument,
  StoreFindOptions,
  StoreList,
} from '@neuledge/store';
import { Metadata, MetadataCollection } from '@/metadata';
import { toDocument } from '../document';

const ALTER_VERSION_RETRIES = 3;

type AlterQueryOptions<
  S extends StateDefinition,
  R extends ReturnState<S> = ReturnState<S>,
> =
  | AlterManyQueryOptions<S, R>
  | AlterFirstQueryOptions<S, R>
  | AlterFirstOrThrowQueryOptions<S, R>
  | AlterUniqueQueryOptions<S, R>
  | AlterUniqueOrThrowQueryOptions<S, R>;

type ReturnState<S extends StateDefinition> = StateDefinitionMutationsReturn<
  S,
  StateDefinitionAlterMethods<S>
>;

type AlterContext<S extends StateDefinition> = {
  entities: Map<string, UpdatedEntity<ReturnState<S>>>;
  metadata: Metadata;
  store: Store;
  collection: MetadataCollection;
  states: StateDefinitionMap<S>;
  options: AlterQueryOptions<S>;
  storeFilters: StoreFindOptions;
};

export const execAlterMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: AlterQueryOptions<S>,
): Promise<
  | Entity<ReturnState<S>>[]
  | ProjectedEntity<ReturnState<S>, Select<ReturnState<S>>>[]
  | void
> => {
  const ctx = await preprareAlter(engine, options);
  if (!ctx) return;

  let documents = await engine.store.find(ctx.storeFilters);
  await alterDocuments(ctx, documents);

  for (let retries = 1; retries < ALTER_VERSION_RETRIES; retries++) {
    let leftDocs: StoreList | undefined;

    if (ctx.entities.size < documents.length) {
      documents = await engine.store.find(ctx.storeFilters);

      leftDocs = documents.filter(
        (document) =>
          !ctx.entities.has(getDocumentKey(ctx.collection, document)),
      );
    }

    if (!leftDocs?.length) {
      return projectEntities([...ctx.entities.values()], options.select);
    }

    await alterDocuments(ctx, leftDocs);
  }

  throw new NeuledgeError(
    NeuledgeErrorCode.VERSION_MISMATCH,
    `Version mismatch while altering ${
      documents.length > 1 ? 'entities' : 'entity'
    }`,
  );
};

export const execAlterOne = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options:
    | AlterFirstQueryOptions<S, ReturnState<S>>
    | AlterFirstOrThrowQueryOptions<S, ReturnState<S>>
    | AlterUniqueQueryOptions<S, ReturnState<S>>
    | AlterUniqueOrThrowQueryOptions<S, ReturnState<S>>,
): Promise<
  | Entity<ReturnState<S>>
  | ProjectedEntity<ReturnState<S>, Select<ReturnState<S>>>
  | void
> => {
  const res = await execAlterMany(engine, options);
  return res?.[0];
};

const preprareAlter = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: AlterQueryOptions<S>,
): Promise<AlterContext<S> | void> => {
  const metadata = await engine.metadata;

  const collection = chooseStatesCollection(metadata, options.states);
  const storeFilters = createStoreFilters(metadata, collection, options);

  if (isAlterDeleteOnly(options)) {
    return deleteDocuments(engine.store, storeFilters, options);
  }

  const states = getStateDefinitionMap(options.states);
  const res = new Map<string, UpdatedEntity<ReturnState<S>>>();

  return {
    entities: res,
    metadata,
    store: engine.store,
    collection,
    states,
    options,
    storeFilters,
  };
};

const createStoreFilters = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  options: AlterQueryOptions<S>,
) => ({
  collectionName: collection.name,

  // FIXME filter by retrive query as well (requireOne)
  // ...convertRetriveQuery(collection, options),

  ...('unique' in options && options.unique
    ? {
        ...convertUniqueFilterQuery(metadata, collection, options),
        ...convertUniqueQuery(metadata, collection, options),
      }
    : convertFilterQuery(metadata, collection, options)),

  ...(options.type === 'AlterMany' ? convertLimitQuery(options) : { limit: 1 }),
});

const isAlterDeleteOnly = <S extends StateDefinition>(
  options: AlterQueryOptions<S>,
): boolean => {
  if (options.select) {
    return false;
  }

  for (const state of options.states) {
    const mutation = state[options.method] as MutationDefinition<S> | undefined;

    if (mutation?.mutation !== 'delete' || !mutation.virtual) {
      return false;
    }
  }

  return true;
};

const deleteDocuments = async <S extends StateDefinition>(
  store: Store,
  storeFilters: StoreDeleteOptions,
  options: AlterQueryOptions<S>,
): Promise<void> => {
  let res;

  do {
    res = await store.delete(storeFilters);
  } while (
    options.type === 'AlterMany' &&
    (!('limit' in options) || options.limit == null) &&
    res.affectedCount >= DEFAULT_QUERY_LIMIT
  );
};

const alterDocuments = async <S extends StateDefinition>(
  ctx: AlterContext<S>,
  documents: StoreList,
): Promise<void> => {
  const convert = ctx.options.type.endsWith('OrThrow')
    ? toEntityListOrThrow
    : toEntityList;

  const list =
    ctx.options.type === 'AlterMany'
      ? checkLimitedList(ctx.options, documents)
      : documents;

  const entities = convert(ctx.metadata, ctx.collection, list);

  const updated = await alterEntityList(
    ctx.states,
    entities,
    ctx.options.method,
    ctx.options.args[0],
  );

  const updatedDocs = updated.map(
    (entity) => entity && toDocument(ctx.metadata, ctx.collection, entity),
  );

  const success = await alterStoreDocuments(
    ctx.store,
    ctx.collection,
    documents,
    updatedDocs,
  );

  for (const [i, flag] of success.entries()) {
    if (!flag) continue;

    const document = updatedDocs[i] ?? documents[i];
    const entity = updated[i] ?? entities[i];

    const key = getDocumentKey(ctx.collection, document);

    ctx.entities.set(key, { document, entity });
  }
};

const getDocumentKey = (
  collection: MetadataCollection,
  document: StoreDocument,
) => JSON.stringify(collection.primaryKeys.map((key) => document[key] ?? null));
