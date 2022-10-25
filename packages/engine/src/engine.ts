import {
  State,
  StateCreateMutations,
  StateDeleteMutations,
  StateMutationArguments,
  StateMutationsReturn,
  StateUpdateWithoutArgsMutations,
  StateUpdateMutations,
} from './generated/index.js';
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
  QueryType,
  QueryOptions,
} from './queries/index.js';
import { EngineStore } from './store.js';

export class NeuledgeEngine<Store extends EngineStore = EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({ type: 'FindMany', states }, this._exec);
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass(
      { type: 'FindUnique', states, unique: true },
      this._exec,
    );
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass(
      {
        type: 'FindUniqueOrThrow',
        states,
        unique: true,
      },
      this._exec,
    );
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({ type: 'FindFirst', states }, this._exec);
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new QueryClass({ type: 'FindFirstOrThrow', states }, this._exec);
  }

  // mutate

  createMany<
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(states: S[], method: M, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass<'CreateMany', S, S>(
      {
        type: 'CreateMany',
        states,
        method,
        args,
      },
      this._exec<'CreateMany', S, S>,
    );
  }

  createOne<
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(states: S[], method: M, args: A): CreateOneQuery<S> {
    return new QueryClass<'CreateOne', S, S>(
      {
        type: 'CreateOne',
        states,
        method,
        args: [args],
      },
      this._exec<'CreateOne', S, S>,
    );
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
    return new QueryClass(
      {
        type: 'UpdateMany',
        states,
        method,
        args: [args ?? ({} as A)],
      },
      this._exec,
    );
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
    return new QueryClass(
      {
        type: 'UpdateFirst',
        states,
        method,
        args: [args ?? ({} as A)],
      },
      this._exec,
    );
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
    return new QueryClass(
      {
        type: 'UpdateFirstOrThrow',
        states,
        method,
        args: [args ?? ({} as A)],
      },
      this._exec,
    );
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
    return new QueryClass(
      {
        type: 'UpdateUnique',
        states,
        method,
        args: [args ?? ({} as A)],
        unique: true,
      },
      this._exec,
    );
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
    return new QueryClass(
      {
        type: 'UpdateUniqueOrThrow',
        states,
        method,
        args: [args ?? ({} as A)],
        unique: true,
      },
      this._exec,
    );
  }

  deleteMany<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteManyQuery<S> {
    return new QueryClass({ type: 'DeleteMany', states, method }, this._exec);
  }

  deleteFirst<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstQuery<S> {
    return new QueryClass({ type: 'DeleteFirst', states, method }, this._exec);
  }

  deleteFirstOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstOrThrowQuery<S> {
    return new QueryClass(
      { type: 'DeleteFirstOrThrow', states, method },
      this._exec,
    );
  }

  deleteUnique<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueQuery<S> {
    return new QueryClass(
      {
        type: 'DeleteUnique',
        states,
        method,
        unique: true,
      },
      this._exec,
    );
  }

  deleteUniqueOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueOrThrowQuery<S> {
    return new QueryClass(
      {
        type: 'DeleteUniqueOrThrow',
        states,
        method,
        unique: true,
      },
      this._exec,
    );
  }

  // exec

  private readonly _exec = async <
    T extends QueryType,
    I extends State,
    O extends State,
  >(
    options: QueryOptions<T, I, O>,
  ) => {
    console.log(options);

    throw new Error('Not implemented');
  };
}
