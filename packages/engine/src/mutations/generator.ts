import {
  MutationDefinition,
  StateDefinition,
  StateDefintionMutations,
} from '@/definitions';
import { Query, QueryMode, QueryOptions, QueryType } from '@/queries';
import { Mutation, MutationType } from './mutation';

export interface MutationGeneratorMethod {
  (...args: Record<string, never>[]): Query<
    QueryMode,
    StateDefinition,
    StateDefinition
  >;
}

export const MutationGenerator = <
  T extends QueryType & MutationType,
  I extends StateDefinition,
>(
  type: T,
  states: I[],
  generator: (
    options: Pick<
      QueryOptions<T, I, StateDefinition>,
      'type' | 'states' | 'method' | 'args'
    >,
  ) => Query<QueryMode, StateDefinition, StateDefinition>,
): Mutation<T, I> =>
  new Proxy({} as Mutation<T, I>, {
    get: (_, method): MutationGeneratorMethod | undefined =>
      hasMutation(type, states, method as never)
        ? (...args) =>
            generator({
              type,
              states,
              method: method as never,
              args: [args[0] ?? {}, ...args.slice(1)] as never,
            })
        : undefined,

    ownKeys: (): string[] => {
      if (!states.length) {
        return [];
      }

      return Object.keys(states[0]).filter((method) =>
        hasMutation(type, states, method as never),
      );
    },

    has: (_, method): boolean => hasMutation(type, states, method as never),
  });

const hasMutation = <
  S extends StateDefinition,
  M extends StateDefintionMutations<S>,
>(
  type: MutationType,
  states: S[],
  method: M,
): boolean =>
  states.every((state) => {
    const fn = state[method] as MutationDefinition<S> | undefined;

    switch (fn?.mutation) {
      case 'create':
        return type.startsWith('Init');

      case 'update':
      case 'delete':
        return type.startsWith('Alter');

      default:
        return false;
    }
  });
