import { Entity } from '@/entity.js';
import { State } from './state.js';

export type MutationA = Record<string, unknown>;

export type Mutation<S extends State, A extends MutationA, R extends State> =
  | CreateMutation<R, A>
  | UpdateMutation<S, A, R>
  | TransformMutation<S, R>
  | DeleteMutation<S>;

export interface CreateMutation<S extends State, A extends MutationA> {
  (this: S, args: A): Resolveable<Entity<S>>;
}

export interface UpdateMutation<
  S extends State,
  A extends MutationA,
  R extends State,
> {
  (this: S, instance: InstanceType<S>, args: A): Resolveable<Entity<R>>;
}

export interface TransformMutation<S extends State, R extends State> {
  (this: S, instance: InstanceType<S>): Resolveable<Entity<R>>;
}

export interface DeleteMutation<S extends State = State> {
  (this: S, instance: InstanceType<S>): Resolveable<void>;
}

type Resolveable<T> = T | PromiseLike<T>;

// state actions

export type StateActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends Mutation<S, any, any> ? K : never;
}[keyof S];

export type StateCreateActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends CreateMutation<S, any> ? K : never;
}[keyof S];

export type StateUpdateActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends UpdateMutation<S, any, any> ? K : never;
}[keyof S];

export type StateTransformActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends TransformMutation<S, any> ? K : never;
}[keyof S];

export type StateDeleteActions<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends DeleteMutation<S> ? K : never;
}[keyof S];

// state action helpers

export type StateActionArguments<
  S extends State,
  K extends keyof S,
> = S[K] extends CreateMutation<S, infer A>
  ? A
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[K] extends UpdateMutation<S, infer A, any>
  ? A
  : never;

export type StateActionReturn<
  S extends State,
  K extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[K] extends CreateMutation<S, any>
  ? S // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : S[K] extends UpdateMutation<S, any, infer R>
  ? R
  : S[K] extends TransformMutation<S, infer R>
  ? R
  : never;
