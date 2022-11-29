import { Metadata } from '@/metadata/metadata.js';
import {
  StateDefinition,
  StateDefinitionCreateMutations,
  StateDefinitionDeleteMutations,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionUpdateWithoutArgsMutations,
  StateDefinitionUpdateMutations,
} from '../definitions/index.js';
import {
  FindFirstOrThrowQuery,
  FindFirstQuery,
  FindManyQuery,
  FindUniqueOrThrowQuery,
  FindUniqueQuery,
  DeleteManyQuery,
  DeleteUniqueQuery,
  DeleteUniqueOrThrowQuery,
  QueryClass,
  DeleteFirstQuery,
  DeleteFirstOrThrowQuery,
  CreateManyQuery,
  CreateOneQuery,
  UpdateManyQuery,
  UpdateFirstQuery,
  UpdateFirstOrThrowQuery,
  UpdateUniqueQuery,
  UpdateUniqueOrThrowQuery,
} from '../queries/index.js';
import { Store } from '../store/index.js';
import { chooseStatesCollection } from './collection.js';
import { toEntityOrThrow, toMaybeEntity } from './entity.js';
import { convertLimitQuery, toLimitedEntityList } from './limit.js';
import { loadMetadata } from './metadata/index.js';
import { convertRetriveQuery } from './retrive/index.js';
import { convertSortQuery } from './sort.js';
import { convertFilterQuery } from './filter/index.js';
import { convertOffsetQuery } from './offset.js';

export interface NeuledgeEngineOptions {
  store: Store;
  metadataCollectionName?: string;
}

export class NeuledgeEngine {
  public readonly store: Store;
  private readonly metadataPromise: Promise<Metadata>;

  constructor(options: NeuledgeEngineOptions) {
    this.store = options.store;

    this.metadataPromise = loadMetadata(
      this.store,
      options.metadataCollectionName,
    );

    this.metadataPromise.catch(() => {
      // ignore errors here and let the user handle them via the exec methods
    });
  }

  // finds

  findMany<S extends StateDefinition>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({
      type: 'FindMany',
      states,
      exec: async (options) => {
        const metadata = await this.metadataPromise;
        const collection = chooseStatesCollection(metadata, options.states);

        return toLimitedEntityList(
          metadata,
          options,
          await this.store.find({
            collectionName: collection.name,
            ...convertRetriveQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            ...convertOffsetQuery(options),
            ...convertLimitQuery(options),
            ...convertSortQuery(collection, options),
          }),
        );
      },
    });
  }

  findUnique<S extends StateDefinition>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: async (options) => {
        const metadata = await this.metadataPromise;
        const collection = chooseStatesCollection(metadata, options.states);

        return toMaybeEntity(
          metadata,
          await this.store.find({
            collectionName: collection.name,
            ...convertRetriveQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            limit: 1,
          }),
        );
      },
    });
  }

  findUniqueOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
      exec: async (options) => {
        const metadata = await this.metadataPromise;
        const collection = chooseStatesCollection(metadata, options.states);

        return toEntityOrThrow(
          metadata,
          await this.store.find({
            collectionName: collection.name,
            ...convertRetriveQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            limit: 1,
          }),
        );
      },
    });
  }

  findFirst<S extends StateDefinition>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({
      type: 'FindFirst',
      states,
      exec: async (options) => {
        const metadata = await this.metadataPromise;
        const collection = chooseStatesCollection(metadata, options.states);

        return toMaybeEntity(
          metadata,
          await this.store.find({
            collectionName: collection.name,
            ...convertRetriveQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            ...convertOffsetQuery(options),
            limit: 1,
            ...convertSortQuery(collection, options),
          }),
        );
      },
    });
  }

  findFirstOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindFirstOrThrow',
      states,
      exec: async (options) => {
        const metadata = await this.metadataPromise;
        const collection = chooseStatesCollection(metadata, options.states);

        return toEntityOrThrow(
          metadata,
          await this.store.find({
            collectionName: collection.name,
            ...convertRetriveQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            ...convertOffsetQuery(options),
            limit: 1,
            ...convertSortQuery(collection, options),
          }),
        );
      },
    });
  }

  // create

  createMany<
    S extends StateDefinition,
    M extends StateDefinitionCreateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(states: S[], method: M, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass<'CreateMany', S, S>({
      type: 'CreateMany',
      states,
      method,
      args,
      exec: async (options) => {},
    });
  }

  createOne<
    S extends StateDefinition,
    M extends StateDefinitionCreateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(states: S[], method: M, args: A): CreateOneQuery<S> {
    return new QueryClass<'CreateOne', S, S>({
      type: 'CreateOne',
      states,
      method,
      args: [args],
      exec: async (options) => {},
    });
  }

  // update

  updateMany<
    S extends StateDefinition,
    M extends StateDefinitionUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateMany<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateMany<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateManyQuery<S, StateDefinitionMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateMany',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateFirst<
    S extends StateDefinition,
    M extends StateDefinitionUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateFirst<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateFirst<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateFirstQuery<S, StateDefinitionMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateFirst',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateFirstOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateFirstOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateFirstOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateFirstOrThrow',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateUnique<
    S extends StateDefinition,
    M extends StateDefinitionUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateUnique<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateUnique<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateUniqueQuery<S, StateDefinitionMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateUnique',
      states,
      method,
      args: [args ?? ({} as A)],
      unique: true,
      exec: async (options) => {},
    });
  }

  updateUniqueOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateUniqueOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
  updateUniqueOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionUpdateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateUniqueOrThrow',
      states,
      method,
      args: [args ?? ({} as A)],
      unique: true,
      exec: async (options) => {},
    });
  }

  // delete

  deleteMany<
    S extends StateDefinition,
    M extends StateDefinitionDeleteMutations<S>,
  >(states: S[], method: M): DeleteManyQuery<S> {
    return new QueryClass({
      type: 'DeleteMany',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteFirst<
    S extends StateDefinition,
    M extends StateDefinitionDeleteMutations<S>,
  >(states: S[], method: M): DeleteFirstQuery<S> {
    return new QueryClass({
      type: 'DeleteFirst',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteFirstOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionDeleteMutations<S>,
  >(states: S[], method: M): DeleteFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'DeleteFirstOrThrow',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteUnique<
    S extends StateDefinition,
    M extends StateDefinitionDeleteMutations<S>,
  >(states: S[], method: M): DeleteUniqueQuery<S> {
    return new QueryClass({
      type: 'DeleteUnique',
      states,
      method,
      unique: true,
      exec: async (options) => {},
    });
  }

  deleteUniqueOrThrow<
    S extends StateDefinition,
    M extends StateDefinitionDeleteMutations<S>,
  >(states: S[], method: M): DeleteUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'DeleteUniqueOrThrow',
      states,
      method,
      unique: true,
      exec: async (options) => {},
    });
  }

  // utils

  async ready(): Promise<this> {
    await this.metadataPromise;
    return this;
  }
}
