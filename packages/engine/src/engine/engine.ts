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
import { EngineExec } from './exec.js';
import { loadMetadata } from './metadata/index.js';

export interface NeuledgeEngineOptions {
  store: Store;
  metadataCollectionName?: string;
}

export class NeuledgeEngine {
  public readonly store: Store;
  private readonly metadata: Promise<Metadata>;
  private readonly exec: EngineExec;

  constructor(options: NeuledgeEngineOptions) {
    this.store = options.store;
    this.metadata = loadMetadata(this.store, options.metadataCollectionName);

    this.metadata.catch(() => {
      // catch unhandled promise
    });

    this.exec = new EngineExec(this.store, this.metadata);
  }

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({
      type: 'FindMany',
      states,
      exec: this.exec.findMany,
    });
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: this.exec.findUnique,
    });
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
      exec: this.exec.findUniqueOrThrow,
    });
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({
      type: 'FindFirst',
      states,
      exec: this.exec.findFirst,
    });
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindFirstOrThrow',
      states,
      exec: this.exec.findFirstOrThrow,
    });
  }

  // mutate

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
      exec: this.exec.createMany,
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
      exec: this.exec.createOne,
    });
  }

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
      exec: this.exec.updateMany,
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
      exec: this.exec.updateFirst,
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
      exec: this.exec.updateFirstOrThrow,
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
      exec: this.exec.updateUnique,
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
      exec: this.exec.updateUniqueOrThrow,
    });
  }

  deleteMany<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteManyQuery<S> {
    return new QueryClass({
      type: 'DeleteMany',
      states,
      method,
      exec: this.exec.deleteMany,
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
      exec: this.exec.deleteFirst,
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
      exec: this.exec.deleteFirstOrThrow,
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
      exec: this.exec.deleteUnique,
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
      exec: this.exec.deleteUniqueOrThrow,
    });
  }
}
