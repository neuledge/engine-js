import {
  State,
  StateCreateMutations,
  StateDeleteMutations,
  StateMutationArguments,
  StateMutationsReturn,
  StateTransformMutations,
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

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  findMany<S extends State>(...states: S[]): FindManyQuery<S> {
    return new QueryClass(states);
  }

  findUnique<S extends State>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass(states, true);
  }

  findUniqueOrThrow<S extends State>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass(states, true);
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
    K extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(states: S[], action: K, ...args: A[]): CreateManyQuery<S> {
    return new QueryClass(states, null, action, args);
  }

  createOne<
    S extends State,
    K extends StateCreateMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(states: S[], action: K, args: A): CreateOneQuery<S> {
    return new QueryClass(states, null, action, [args]);
  }

  updateMany<S extends State, K extends StateTransformMutations<S>>(
    states: S[],
    action: K,
  ): UpdateManyQuery<S, StateMutationsReturn<S, K>>;
  updateMany<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateManyQuery<S, StateMutationsReturn<S, K>>;
  updateMany<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateManyQuery<S, StateMutationsReturn<S, K>> {
    return new QueryClass(states, null, action, [args ?? ({} as A)]);
  }

  updateFirst<S extends State, K extends StateTransformMutations<S>>(
    states: S[],
    action: K,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, K>>;
  updateFirst<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, K>>;
  updateFirst<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateFirstQuery<S, StateMutationsReturn<S, K>> {
    return new QueryClass(states, null, action, [args ?? ({} as A)]);
  }

  updateFirstOrThrow<S extends State, K extends StateTransformMutations<S>>(
    states: S[],
    action: K,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, K>>;
  updateFirstOrThrow<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, K>>;
  updateFirstOrThrow<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateFirstOrThrowQuery<S, StateMutationsReturn<S, K>> {
    return new QueryClass(states, null, action, [args ?? ({} as A)]);
  }

  updateUnique<S extends State, K extends StateTransformMutations<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, K>>;
  updateUnique<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, K>>;
  updateUnique<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateUniqueQuery<S, StateMutationsReturn<S, K>> {
    return new QueryClass(states, true, action, [args ?? ({} as A)]);
  }

  updateUniqueOrThrow<S extends State, K extends StateTransformMutations<S>>(
    states: S[],
    action: K,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, K>>;
  updateUniqueOrThrow<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args: A,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, K>>;
  updateUniqueOrThrow<
    S extends State,
    K extends StateUpdateMutations<S> | StateTransformMutations<S>,
    A extends StateMutationArguments<S, K>,
  >(
    states: S[],
    action: K,
    args?: A,
  ): UpdateUniqueOrThrowQuery<S, StateMutationsReturn<S, K>> {
    return new QueryClass(states, true, action, [args ?? ({} as A)]);
  }

  deleteMany<S extends State, K extends StateDeleteMutations<S>>(
    states: S[],
    action: K,
  ): DeleteManyQuery<S> {
    return new QueryClass(states, null, action);
  }

  deleteFirst<S extends State, K extends StateDeleteMutations<S>>(
    states: S[],
    action: K,
  ): DeleteFirstQuery<S> {
    return new QueryClass(states, null, action);
  }

  deleteOneOrThrow<S extends State, K extends StateDeleteMutations<S>>(
    states: S[],
    action: K,
  ): DeleteFirstOrThrowQuery<S> {
    return new QueryClass(states, null, action);
  }

  deleteUnique<S extends State, K extends StateDeleteMutations<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueQuery<S> {
    return new QueryClass(states, true, action);
  }

  deleteUniqueOrThrow<S extends State, K extends StateDeleteMutations<S>>(
    states: S[],
    action: K,
  ): DeleteUniqueOrThrowQuery<S> {
    return new QueryClass(states, true, action);
  }
}
