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
} from './queries/index.js';
import { EngineStore } from './store.js';

export class NeuledgeEngine<Store extends EngineStore = EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new QueryClass(this, { type: 'FindMany', states });
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass(this, { type: 'FindUnique', states, unique: true });
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass(this, {
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
    });
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass(this, { type: 'FindFirst', states });
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new QueryClass(this, { type: 'FindFirstOrThrow', states });
  }

  // mutate

  createMany<
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(states: S[], method: M, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass<'CreateMany', S, S>(this, {
      type: 'CreateMany',
      states,
      method,
      args,
    });
  }

  createOne<
    S extends State,
    M extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, M>,
  >(states: S[], method: M, args: A): CreateOneQuery<S> {
    return new QueryClass<'CreateOne', S, S>(this, {
      type: 'CreateOne',
      states,
      method,
      args: [args],
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
    return new QueryClass(this, {
      type: 'UpdateMany',
      states,
      method,
      args: [args ?? ({} as A)],
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
    return new QueryClass(this, {
      type: 'UpdateFirst',
      states,
      method,
      args: [args ?? ({} as A)],
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
    return new QueryClass(this, {
      type: 'UpdateFirstOrThrow',
      states,
      method,
      args: [args ?? ({} as A)],
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
    return new QueryClass(this, {
      type: 'UpdateUnique',
      states,
      method,
      args: [args ?? ({} as A)],
      unique: true,
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
    return new QueryClass(this, {
      type: 'UpdateUniqueOrThrow',
      states,
      method,
      args: [args ?? ({} as A)],
      unique: true,
    });
  }

  deleteMany<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteManyQuery<S> {
    return new QueryClass(this, { type: 'DeleteMany', states, method });
  }

  deleteFirst<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstQuery<S> {
    return new QueryClass(this, { type: 'DeleteFirst', states, method });
  }

  deleteFirstOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteFirstOrThrowQuery<S> {
    return new QueryClass(this, { type: 'DeleteFirstOrThrow', states, method });
  }

  deleteUnique<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueQuery<S> {
    return new QueryClass(this, {
      type: 'DeleteUnique',
      states,
      method,
      unique: true,
    });
  }

  deleteUniqueOrThrow<S extends State, M extends StateDeleteMutations<S>>(
    states: S[],
    method: M,
  ): DeleteUniqueOrThrowQuery<S> {
    return new QueryClass(this, {
      type: 'DeleteUniqueOrThrow',
      states,
      method,
      unique: true,
    });
  }
}
