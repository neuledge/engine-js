import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionType } from './state';

export type MutationDefinitionArguments = Record<string, unknown>;

export type MutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
  R extends StateDefinition,
> =
  | CreateMutationDefinition<R, A>
  | UpdateMutationDefinition<S, A, R>
  | TransformMutationDefinition<S, R>
  | DeleteMutationDefinition<S>;

export interface CreateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
> {
  (this: null, args: A): Resolveable<Entity<S>>;
}

export interface UpdateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
  R extends StateDefinition,
> {
  (this: StateDefinitionType<S>, args: A): Resolveable<Entity<R>>;
}

export interface TransformMutationDefinition<
  S extends StateDefinition,
  R extends StateDefinition,
> {
  (this: StateDefinitionType<S>): Resolveable<Entity<R>>;
}

export interface DeleteMutationDefinition<
  S extends StateDefinition = StateDefinition,
> {
  (this: StateDefinitionType<S>): Resolveable<void>;
}

type Resolveable<T> = T | PromiseLike<T>;

// state methods

export type StateDefintionMutations<S extends StateDefinition> =
  | StateDefinitionCreateMutations<S>
  | StateDefinitionUpdateMutations<S>
  | StateDefinitionDeleteMutations<S>;

export type StateDefinitionCreateMutations<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends CreateMutationDefinition<S, any> ? M : never;
}[keyof S];

export type StateDefinitionUpdateMutations<S extends StateDefinition> =
  | StateDefinitionUpdateWithArgsMutations<S>
  | StateDefinitionUpdateWithoutArgsMutations<S>;

export type StateDefinitionUpdateWithArgsMutations<S extends StateDefinition> =
  {
    [M in keyof S]: S[M] extends UpdateMutationDefinition<
      S,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      StateDefinition<string, object>
    >
      ? M
      : never;
  }[keyof S];

export type StateDefinitionUpdateWithoutArgsMutations<
  S extends StateDefinition,
> = {
  [M in keyof S]: S[M] extends TransformMutationDefinition<
    S,
    StateDefinition<string, object>
  >
    ? M
    : never;
}[keyof S];

export type StateDefinitionDeleteMutations<S extends StateDefinition> = {
  [M in keyof S]: S[M] extends DeleteMutationDefinition<S> ? M : never;
}[keyof S];

// state mutation helpers

export type StateDefinitionMutationArguments<
  S extends StateDefinition,
  M extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[M] extends (this: any, args: infer A) => any
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unknown extends A
    ? Record<string, never>
    : A
  : Record<string, never>;

export type StateDefinitionMutationsReturn<
  S extends StateDefinition,
  M extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[M] extends DeleteMutationDefinition<any>
  ? never
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends CreateMutationDefinition<S, any>
  ? S
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends UpdateMutationDefinition<any, any, infer R>
  ? R
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S[M] extends TransformMutationDefinition<any, infer R>
  ? R
  : never;
