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
    return new QueryClass({ type: 'FindMany', states, exec: this.exec });
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: this.exec,
    });
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
      exec: this.exec,
    });
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({ type: 'FindFirst', states, exec: this.exec });
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindFirstOrThrow',
      states,
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
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
      exec: this.exec,
    });
  }

  // exec

  private readonly exec = async function <
    T extends QueryType = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    I extends State = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    O extends State = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  >(this: QueryOptions<T, I, O>) {
    console.log(this);

    throw new Error('Not implemented');
  };
}
