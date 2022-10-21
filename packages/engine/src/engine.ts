import {
  State,
  StateActionArguments,
  StateCreateActions,
  StateDeleteActions,
  StateTransformActions,
  StateUpdateActions,
} from './generated/index.js';
import {
  FindFirstOrThrowQuery,
  FindFirstQuery,
  FindManyQuery,
  FindUniqueOrThrowQuery,
  FindUniqueQuery,
  CreateOneQuery,
  CreateManyQuery,
  UpdateManyQuery,
  UpdateOneQuery,
  UpdateOneOrThrowQuery,
  DeleteManyQuery,
  DeleteOneQuery,
  DeleteOneOrThrowQuery,
  UpdateUniqueOrThrowQuery,
  UpdateUniqueQuery,
  DeleteUniqueQuery,
  DeleteUniqueOrThrowQuery,
} from './queries/index.js';
import { EngineStore } from './store.js';

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new FindManyQuery(states);
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new FindUniqueQuery(states);
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new FindUniqueOrThrowQuery(states);
  }

  findFirst<S extends State>(...states: S[]): FindFirstQuery<S> {
    return new FindFirstQuery(states);
  }

  findFirstOrThrow<S extends State>(...states: S[]): FindFirstOrThrowQuery<S> {
    return new FindFirstOrThrowQuery(states);
  }

  // mutate

  createMany<
    S extends State,
    K extends StateCreateActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, ...args: A[]): CreateManyQuery<S, K, A> {
    return new CreateManyQuery(states, action, ...args);
  }

  createOne<
    S extends State,
    K extends StateCreateActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args: A): CreateOneQuery<S, K, A> {
    return new CreateOneQuery(states, action, args);
  }

  updateMany<S extends State, K extends StateTransformActions<S>>(
    states: S[],
    action: K,
  ): UpdateManyQuery<S, K, never>;
  // updateMany<
  //   S extends State,
  //   K extends StateUpdateActions<S> | StateTransformActions<S>,
  //   A extends StateActionArguments<S, K>,
  // >(states: S[], action: K, args: A): UpdateManyQuery<S, K, A>;
  updateMany<
    S extends State,
    K extends StateUpdateActions<S> | StateTransformActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args?: A): UpdateManyQuery<S, K, A> {
    return new UpdateManyQuery(states, action, args ?? ({} as A));
  }

  updateOne<S extends State, K extends StateTransformActions<S>>(
    states: S[],
    action: K,
  ): UpdateOneQuery<S, K, never>;
  // updateOne<
  //   S extends State,
  //   K extends StateUpdateActions<S> | StateTransformActions<S>,
  //   A extends StateActionArguments<S, K>,
  // >(states: S[], action: K, args: A): UpdateOneQuery<S, K, A>;
  updateOne<
    S extends State,
    K extends StateUpdateActions<S> | StateTransformActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args?: A): UpdateOneQuery<S, K, A> {
    return new UpdateOneQuery(states, action, args ?? ({} as A));
  }

  updateOneOrThrow<S extends State, K extends StateTransformActions<S>>(
    states: S[],
    action: K,
  ): UpdateOneOrThrowQuery<S, K, never>;
  // updateOneOrThrow<
  //   S extends State,
  //   K extends StateUpdateActions<S> | StateTransformActions<S>,
  //   A extends StateActionArguments<S, K>,
  // >(states: S[], action: K, args: A): UpdateOneOrThrowQuery<S, K, A>;
  updateOneOrThrow<
    S extends State,
    K extends StateUpdateActions<S> | StateTransformActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args?: A): UpdateOneOrThrowQuery<S, K, A> {
    return new UpdateOneOrThrowQuery(states, action, args ?? ({} as A));
  }

  updateUnique<S extends State, K extends StateTransformActions<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueQuery<S, K, never>;
  // updateUnique<
  //   S extends State,
  //   K extends StateUpdateActions<S> | StateTransformActions<S>,
  //   A extends StateActionArguments<S, K>,
  // >(states: S[], action: K, args: A): UpdateUniqueQuery<S, K, A>;
  updateUnique<
    S extends State,
    K extends StateUpdateActions<S> | StateTransformActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args?: A): UpdateUniqueQuery<S, K, A> {
    return new UpdateUniqueQuery(states, action, args ?? ({} as A));
  }

  updateUniqueOrThrow<S extends State, K extends StateTransformActions<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueOrThrowQuery<S, K, never>;
  // updateUniqueOrThrow<
  //   S extends State,
  //   K extends StateUpdateActions<S> | StateTransformActions<S>,
  //   A extends StateActionArguments<S, K>,
  // >(states: S[], action: K, args: A): UpdateUniqueOrThrowQuery<S, K, A>;
  updateUniqueOrThrow<
    S extends State,
    K extends StateUpdateActions<S> | StateTransformActions<S>,
    A extends StateActionArguments<S, K>,
  >(states: S[], action: K, args?: A): UpdateUniqueOrThrowQuery<S, K, A> {
    return new UpdateUniqueOrThrowQuery(states, action, args ?? ({} as A));
  }

  deleteMany<S extends State, K extends StateDeleteActions<S>>(
    states: S[],
    action: K,
  ): DeleteManyQuery<S, K> {
    return new DeleteManyQuery(states, action);
  }

  deleteOne<S extends State, K extends StateDeleteActions<S>>(
    states: S[],
    action: K,
  ): DeleteOneQuery<S, K> {
    return new DeleteOneQuery(states, action);
  }

  deleteOneOrThrow<S extends State, K extends StateDeleteActions<S>>(
    states: S[],
    action: K,
  ): DeleteOneOrThrowQuery<S, K> {
    return new DeleteOneOrThrowQuery(states, action);
  }

  deleteUnique<S extends State, K extends StateDeleteActions<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueQuery<S, K> {
    return new DeleteUniqueQuery(states, action);
  }

  deleteUniqueOrThrow<S extends State, K extends StateDeleteActions<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueOrThrowQuery<S, K> {
    return new DeleteUniqueOrThrowQuery(states, action);
  }
}
