import { Entity } from '@/entity.js';
import { State } from './state.js';

export type MutationArguments = Record<string, unknown>;

export type Mutation<
  S extends State,
  A extends MutationArguments,
  R extends State,
> =
  | CreateMutation<R, A>
  | UpdateMutation<S, A, R>
  | TransformMutation<S, R>
  | DeleteMutation<S>;

export interface CreateMutation<S extends State, A extends MutationArguments> {
  (this: null, args: A): Resolveable<Entity<S>>;
}

export interface UpdateMutation<
  S extends State,
  A extends MutationArguments,
  R extends State,
> {
  (this: InstanceType<S>, args: A): Resolveable<Entity<R>>;
}

export interface TransformMutation<S extends State, R extends State> {
  (this: InstanceType<S>): Resolveable<Entity<R>>;
}

export interface DeleteMutation<S extends State = State> {
  (this: InstanceType<S>): Resolveable<void>;
}

type Resolveable<T> = T | PromiseLike<T>;

// state actions

export type StateActions<S extends State> =
  | StateCreateActions<S>
  | StateUpdateActions<S>
  | StateTransformActions<S>
  | StateDeleteActions<S>;

export type StateCreateActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends CreateMutation<S, any> ? K : never;
}[keyof S];

export type StateUpdateActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends UpdateMutation<S, any, State<string, object>>
    ? K
    : never;
}[keyof S];

export type StateTransformActions<S extends State> = {
  [K in keyof S]: S[K] extends TransformMutation<S, State<string, object>>
    ? K
    : never;
}[keyof S];

export type StateDeleteActions<S extends State> = {
  [K in keyof S]: S[K] extends DeleteMutation<S> ? K : never;
}[keyof S];

// state action helpers

export type StateActionArguments<
  S extends State,
  K extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[K] extends (this: any, args: infer A) => any
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unknown extends A
    ? Record<string, never>
    : A
  : Record<string, never>;

export type StateActionReturn<
  S extends State,
  K extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[K] extends DeleteMutation<any>
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[K] extends CreateMutation<S, any>
  ? S
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[K] extends UpdateMutation<any, any, infer R>
  ? R
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[K] extends TransformMutation<any, infer R>
  ? R
  : null;
