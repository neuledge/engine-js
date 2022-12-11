import { Metadata } from '@/metadata/metadata';
import {
  StateDefinition,
  StateDefinitionCreateMutations,
  StateDefinitionDeleteMutations,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionUpdateWithoutArgsMutations,
  StateDefinitionUpdateMutations,
} from '../definitions';
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
} from '../queries';
import { Store } from '../store';
import { loadMetadata } from './metadata';
import {
  execCreateMany,
  execCreateOne,
  execDeleteEntityOrThrow,
  execDeleteMany,
  execDeleteMaybeEntity,
  execFindFirst,
  execFindFirstOrThrow,
  execFindMany,
  execFindUnique,
  execFindUniqueOrThrow,
  execUpdateEntityOrThrow,
  execUpdateMany,
  execUpdateMaybeEntity,
} from './exec';

export interface NeuledgeEngineOptions {
  store: Store;
  metadataCollectionName?: string;
}

export class NeuledgeEngine {
  public readonly store: Store;
  public readonly metadata: Promise<Metadata>;

  constructor(options: NeuledgeEngineOptions) {
    this.store = options.store;

    this.metadata = loadMetadata(this.store, options.metadataCollectionName);

    this.metadata.catch(() => {
      // ignore errors here and let the user handle them via the exec methods
    });
  }

  // finds

  findMany<S extends StateDefinition>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({
      type: 'FindMany',
      states,
      exec: (options) => execFindMany(this, options),
    });
  }

  findUnique<S extends StateDefinition>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: (options) => execFindUnique(this, options),
    });
  }

  findUniqueOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
      exec: (options) => execFindUniqueOrThrow(this, options),
    });
  }

  findFirst<S extends StateDefinition>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({
      type: 'FindFirst',
      states,
      exec: (options) => execFindFirst(this, options),
    });
  }

  findFirstOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindFirstOrThrow',
      states,
      exec: (options) => execFindFirstOrThrow(this, options),
    });
  }

  // create

  createMany<
    S extends StateDefinition,
    M extends StateDefinitionCreateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(state: S, method: M, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass<'CreateMany', S, S>({
      type: 'CreateMany',
      states: [state],
      method,
      args,
      exec: (options) => execCreateMany(this, options),
    });
  }

  createOne<
    S extends StateDefinition,
    M extends StateDefinitionCreateMutations<S>,
    A extends StateDefinitionMutationArguments<S, M>,
  >(state: S, method: M, args: A): CreateOneQuery<S> {
    return new QueryClass<'CreateOne', S, S>({
      type: 'CreateOne',
      states: [state],
      method,
      args: [args],
      exec: (options) => execCreateOne(this, options),
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
      exec: (options) => execUpdateMany(this, options),
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
      exec: (options) => execUpdateMaybeEntity(this, options),
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
      exec: (options) => execUpdateEntityOrThrow(this, options),
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
      exec: (options) => execUpdateMaybeEntity(this, options),
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
      exec: (options) => execUpdateEntityOrThrow(this, options),
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
      exec: (options) => execDeleteMany(this, options),
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
      exec: (options) => execDeleteMaybeEntity(this, options),
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
      exec: (options) => execDeleteEntityOrThrow(this, options),
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
      exec: (options) => execDeleteMaybeEntity(this, options),
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
      exec: (options) => execDeleteEntityOrThrow(this, options),
    });
  }

  // utils

  async ready(): Promise<this> {
    await this.metadata;
    return this;
  }
}
