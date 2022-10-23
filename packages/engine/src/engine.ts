import {
  State,
  StateCreateMethods,
  StateDeleteMethods,
  StateMethodArguments,
  StateMethodReturn,
  StateTransformMethods,
  StateUpdateMethods,
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

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new QueryClass(states);
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass(states);
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass(states);
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass(states);
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new QueryClass(states);
  }

  // mutate

  createMany<
    S extends State,
    K extends StateCreateMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(states: S[], action: K, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass(states, action, args);
  }

  createOne<
    S extends State,
    K extends StateCreateMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(states: S[], action: K, args: A): CreateOneQuery<S> {
    return new QueryClass(states, action, args);
  }

  updateMany<S extends State, K extends StateTransformMethods<S>>(
    states: S[],
    action: K,
  ): UpdateManyQuery<S, StateMethodReturn<S, K>>;
  updateMany<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateManyQuery<S, StateMethodReturn<S, K>>;
  updateMany<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateManyQuery<S, StateMethodReturn<S, K>> {
    return new QueryClass(states, action, args ?? ({} as A));
  }

  updateFirst<S extends State, K extends StateTransformMethods<S>>(
    states: S[],
    action: K,
  ): UpdateFirstQuery<S, StateMethodReturn<S, K>>;
  updateFirst<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateFirstQuery<S, StateMethodReturn<S, K>>;
  updateFirst<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateFirstQuery<S, StateMethodReturn<S, K>> {
    return new QueryClass(states, action, args ?? ({} as A));
  }

  updateFirstOrThrow<S extends State, K extends StateTransformMethods<S>>(
    states: S[],
    action: K,
  ): UpdateFirstOrThrowQuery<S, StateMethodReturn<S, K>>;
  updateFirstOrThrow<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateFirstOrThrowQuery<S, StateMethodReturn<S, K>>;
  updateFirstOrThrow<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateFirstOrThrowQuery<S, StateMethodReturn<S, K>> {
    return new QueryClass(states, action, args ?? ({} as A));
  }

  updateUnique<S extends State, K extends StateTransformMethods<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueQuery<S, StateMethodReturn<S, K>>;
  updateUnique<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateUniqueQuery<S, StateMethodReturn<S, K>>;
  updateUnique<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateUniqueQuery<S, StateMethodReturn<S, K>> {
    return new QueryClass(states, action, args ?? ({} as A));
  }

  updateUniqueOrThrow<S extends State, K extends StateTransformMethods<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueOrThrowQuery<S, StateMethodReturn<S, K>>;
  updateUniqueOrThrow<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateUniqueOrThrowQuery<S, StateMethodReturn<S, K>>;
  updateUniqueOrThrow<
    S extends State,
    K extends StateUpdateMethods<S> | StateTransformMethods<S>,
    A extends StateMethodArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateUniqueOrThrowQuery<S, StateMethodReturn<S, K>> {
    return new QueryClass(states, action, args ?? ({} as A));
  }

  deleteMany<S extends State, K extends StateDeleteMethods<S>>(
    states: S[],
    action: K,
  ): DeleteManyQuery<S> {
    return new QueryClass(states, action);
  }

  deleteFirst<S extends State, K extends StateDeleteMethods<S>>(
    states: S[],
    action: K,
  ): DeleteFirstQuery<S> {
    return new QueryClass(states, action);
  }

  deleteOneOrThrow<S extends State, K extends StateDeleteMethods<S>>(
    states: S[],
    action: K,
  ): DeleteFirstOrThrowQuery<S> {
    return new QueryClass(states, action);
  }

  deleteUnique<S extends State, K extends StateDeleteMethods<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueQuery<S> {
    return new QueryClass(states, action);
  }

  deleteUniqueOrThrow<S extends State, K extends StateDeleteMethods<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueOrThrowQuery<S> {
    return new QueryClass(states, action);
  }
}
