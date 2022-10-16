import { State, StateEntity } from './state.js';

export interface Mutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends Record<string, unknown> = any,
  R extends State = State,
> {
  (instance: T, args: Args): Resolveable<StateEntity<R> | void>;
}

export type MutationSelect<S extends State, A extends keyof S> = MutationState<
  S,
  A
>['$projection'];

export type MutationState<
  S extends State,
  A extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[A] extends (instance: any, args: any) => Resolveable<StateEntity<infer R>>
  ? R
  : never;

export type MutationArguments<
  S extends State,
  A extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[A] extends (instance: any, args: undefined) => any
  ? Record<string, never>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[A] extends (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: infer Args,
    ) => Resolveable<StateEntity<State> | void>
  ? Args
  : never;

export type MutationName<
  S extends State,
  K extends keyof S,
> = S[K] extends Mutation ? K : never;

export type ProjectedMutationName<
  S extends State,
  K extends keyof S,
> = S[K] extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
) => Resolveable<StateEntity<State>>
  ? K
  : never;

type Resolveable<T> = T | PromiseLike<T>;
