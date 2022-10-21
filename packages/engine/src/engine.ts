import { State } from './generated/index.js';
import {
  FindFirstOrThrowQuery,
  FindFirstQuery,
  FindManyQuery,
  FindUniqueOrThrowQuery,
  FindUniqueQuery,
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

  //   mutateMany<
  //     S extends State,
  //     K extends StateCreateActions<S>,
  //     A extends StateActionArguments<S, K>,
  //   >(states: S[], action: K, ...args: A[]): MutateManyQuery<S>;
  //   mutateMany<
  //     S extends State,
  //     K extends StateUpdateActions<S>,
  //     A extends StateActionArguments<S, K>,
  //   >(states: S[], action: K, args: A): MutateManyQuery<S>;
  //   mutateMany<S extends State, K extends StateTransformActions<S>>(
  //     states: S[],
  //     action: K,
  //     args?: Record<string, never>,
  //   ): MutateManyQuery<S>;
  //   mutateMany<S extends State, K extends StateDeleteActions<S>>(
  //     states: S[],
  //     action: K,
  //     args?: Record<string, never>,
  //   ): MutateManyQuery<S>;
  //   mutateMany<
  //     S extends State,
  //     K extends StateCreateActions<S>,
  //     A extends StateActionArguments<S, K>,
  //   >(states: S[], action: K, ...args: A[]): MutateManyQuery<S> {
  //     return new MutateOneQuery(states, action, args);
  //   }
  //
  //   mutateFirst<S extends State>(
  //     states: S[],
  //     action: string,
  //     args?: {},
  //   ): MutateFirstQuery<S> {
  //     return new MutateFirstQuery(states);
  //   }
  //
  //   mutateFirstOrThrow<S extends State>(
  //     states: S[],
  //     action: string,
  //     args?: {},
  //   ): MutateFirstOrThrowQuery<S> {
  //     return new MutateFirstOrThrowQuery(states);
  //   }
  //
  //   mutateUnique<S extends State>(
  //     states: S[],
  //     action: string,
  //     args?: {},
  //   ): MutateUniqueQuery<S> {
  //     return new MutateUniqueQuery(states);
  //   }
  //
  //   mutateUniqueOrThrow<S extends State>(
  //     states: S[],
  //     action: string,
  //     args?: {},
  //   ): MutateUniqueOrThrowQuery<S> {
  //     return new MutateUniqueOrThrowQuery(states);
  //   }
}
