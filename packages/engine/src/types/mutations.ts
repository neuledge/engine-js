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
>['Projection'];

export type MutationState<
  S extends State,
  A extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[A] extends (...args: any) => Resolveable<StateEntity<infer R>>
  ? R
  : never;

export type MutationArguments<
  S extends State,
  A extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[A] extends (instance: any, args?: Record<string, never>) => any
  ? Record<string, never>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[A] extends Mutation<any, infer Args, any>
  ? Args
  : never;

export type MutationName<
  K extends keyof S,
  S extends State,
> = S[K] extends Mutation ? K : never;

export type ProjectedMutationName<
  K extends keyof S,
  S extends State,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[K] extends (...args: any) => Resolveable<StateEntity<State<unknown>>>
  ? K
  : never;

type Resolveable<T> = T | PromiseLike<T>;
