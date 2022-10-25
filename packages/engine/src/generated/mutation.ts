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

// state methods

export type StateMutations<S extends State> =
  | StateCreateMutations<S>
  | StateUpdateMutations<S>
  | StateTransformMutations<S>
  | StateDeleteMutations<S>;

export type StateCreateMutations<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends CreateMutation<S, any> ? M : never;
}[keyof S];

export type StateUpdateMutations<S extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends UpdateMutation<S, any, State<string, object>>
    ? M
    : never;
}[keyof S];

export type StateTransformMutations<S extends State> = {
  [M in keyof S]: S[M] extends TransformMutation<S, State<string, object>>
    ? M
    : never;
}[keyof S];

export type StateDeleteMutations<S extends State> = {
  [M in keyof S]: S[M] extends DeleteMutation<S> ? M : never;
}[keyof S];

// state mutation helpers

export type StateMutationArguments<
  S extends State,
  M extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[M] extends (this: any, args: infer A) => any
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unknown extends A
    ? Record<string, never>
    : A
  : Record<string, never>;

export type StateMutationsReturn<
  S extends State,
  M extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[M] extends DeleteMutation<any>
  ? never
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends CreateMutation<S, any>
  ? S
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends UpdateMutation<any, any, infer R>
  ? R
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends TransformMutation<any, infer R>
  ? R
  : never;
