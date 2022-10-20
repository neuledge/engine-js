import { State, StateEntity } from './state.js';

export interface Creation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends Record<string, unknown> = any,
  R extends State = State,
> {
  (args: Args): Resolveable<StateEntity<R>>;
}

export type CreationSelect<S extends State> = S['$projection'];

export type CreationArguments<
  S extends State,
  A extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[A] extends (args: undefined) => any
  ? Record<string, never>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[A] extends Creation<infer Args, any>
  ? Args
  : never;

export type CreationName<S extends State, K extends keyof S> = S[K] extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any,
) => Resolveable<StateEntity<S>>
  ? K
  : never;

type Resolveable<T> = T | PromiseLike<T>;
