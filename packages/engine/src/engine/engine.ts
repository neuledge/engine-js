import { Metadata } from '@/metadata/metadata.js';
import {
  State,
  StateCreateMutations,
  StateDeleteMutations,
  StateMutationArguments,
  StateMutationsReturn,
  StateUpdateWithoutArgsMutations,
  StateUpdateMutations,
} from '../generated/index.js';
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
import { convertSelectQuery } from './select.js';
import { convertSortQuery } from './sort.js';
import { convertFilterQuery } from './filter.js';
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

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
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
            ...convertSelectQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            ...convertOffsetQuery(options),
            ...convertLimitQuery(options),
            ...convertSortQuery(collection, options),
          }),
        );
      },
    });
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
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
            ...convertSelectQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            limit: 1,
          }),
        );
      },
    });
  }

  findUniqueOrThrow<S extends State>(
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
            ...convertSelectQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            limit: 1,
          }),
        );
      },
    });
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
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
            ...convertSelectQuery(collection, options),
            ...convertFilterQuery(metadata, collection, options),
            ...convertOffsetQuery(options),
            limit: 1,
            ...convertSortQuery(collection, options),
          }),
        );
      },
    });
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
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
            ...convertSelectQuery(collection, options),
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
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
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
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
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

  updateMany<S extends State, M extends StateUpdateWithoutArgsMutations<S>>(
    states: S[],
    method: M,
  ): UpdateManyQuery<S, StateMutationsReturn<S, M>>;
  updateMany<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateManyQuery<S, StateMutationsReturn<S, M>>;
  updateMany<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateManyQuery<S, StateMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateMany',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateFirst<S extends State, M extends StateUpdateWithoutArgsMutations<S>>(
    states: S[],
    method: M,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, M>>;
  updateFirst<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, M>>;
  updateFirst<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateFirst',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateFirstOrThrow<
    S extends State,
    M extends StateUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, M>>;
  updateFirstOrThrow<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, M>>;
  updateFirstOrThrow<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, M>> {
    return new QueryClass({
      type: 'UpdateFirstOrThrow',
      states,
      method,
      args: [args ?? ({} as A)],
      exec: async (options) => {},
    });
  }

  updateUnique<S extends State, M extends StateUpdateWithoutArgsMutations<S>>(
    states: S[],
    method: M,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, M>>;
  updateUnique<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, M>>;
  updateUnique<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, M>> {
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
    S extends State,
    M extends StateUpdateWithoutArgsMutations<S>,
  >(
    states: S[],
    method: M,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, M>>;
  updateUniqueOrThrow<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args: A,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, M>>;
  updateUniqueOrThrow<
    S extends State,
    M extends StateUpdateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(
    states: S[],
    method: M,
    args?: A,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, M>> {
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

  deleteMany<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteManyQuery<S> {
    return new QueryClass({
      type: 'DeleteMany',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteFirst<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstQuery<S> {
    return new QueryClass({
      type: 'DeleteFirst',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteFirstOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'DeleteFirstOrThrow',
      states,
      method,
      exec: async (options) => {},
    });
  }

  deleteUnique<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueQuery<S> {
    return new QueryClass({
      type: 'DeleteUnique',
      states,
      method,
      unique: true,
      exec: async (options) => {},
    });
  }

  deleteUniqueOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueOrThrowQuery<S> {
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
