import { MutatedEntity } from '@/entity';
import {
  StateDefinition,
  StateDefinitionName,
  StateDefinitionType,
} from './state';

export type MutationDefinitionArguments = Record<string, unknown>;

export type MutationDefinition<
  S extends StateDefinition = StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> =
  | CreateMutationDefinition<R, A>
  | UpdateWitArgsMutationDefinition<S, A, R>
  | UpdateWithoutArgsMutationDefinition<S, R>
  | DeleteMutationDefinition<S>;

export interface CreateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
> {
  readonly mutation: 'create';
  (this: void, args: A): Resolveable<MutatedEntity<S>>;
}

export type UpdateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> =
  | UpdateWitArgsMutationDefinition<S, A, R>
  | UpdateWithoutArgsMutationDefinition<S, R>;

interface UpdateWitArgsMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> {
  readonly mutation: 'update';
  (this: StateDefinitionType<S>, args: A): Resolveable<MutatedEntity<R>>;
}

interface UpdateWithoutArgsMutationDefinition<
  S extends StateDefinition,
  R extends StateDefinition = StateDefinition,
> {
  readonly mutation: 'update';
  (this: StateDefinitionType<S>): Resolveable<MutatedEntity<R>>;
}

export interface DeleteMutationDefinition<S extends StateDefinition> {
  readonly mutation: 'delete';
  readonly virtual?: boolean;
  (this: StateDefinitionType<S>): Resolveable<void>;
}

type Resolveable<T> = T | PromiseLike<T>;

// state methods

export type StateDefintionMutations<S extends StateDefinition> =
  | StateDefinitionCreateMutations<S>
  | StateDefinitionUpdateMutations<S>
  | StateDefinitionDeleteMutations<S>;

export type StateDefinitionUpdateMutations<S extends StateDefinition> =
  | StateDefinitionUpdateWithArgsMutations<S>
  | StateDefinitionUpdateWithoutArgsMutations<S>;

export type StateDefinitionAlterMutations<S extends StateDefinition> =
  | StateDefinitionAlterWithArgsMutations<S>
  | StateDefinitionAlterWithoutArgsMutations<S>;

export type StateDefinitionAlterWithArgsMutations<S extends StateDefinition> =
  StateDefinitionUpdateWithArgsMutations<S>;

export type StateDefinitionAlterWithoutArgsMutations<
  S extends StateDefinition,
> =
  | StateDefinitionUpdateWithoutArgsMutations<S>
  | StateDefinitionDeleteMutations<S>;

export type StateDefinitionCreateMutations<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends CreateMutationDefinition<S, any> ? M : never;
}[keyof S];

export type StateDefinitionUpdateWithArgsMutations<S extends StateDefinition> =
  {
    [M in keyof S]: S[M] extends UpdateWitArgsMutationDefinition<
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
  [M in keyof S]: S[M] extends UpdateWithoutArgsMutationDefinition<
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
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [N in StateDefinitionName<S>]: S extends StateDefinition<N, any>
    ? S[M] extends DeleteMutationDefinition<S>
      ? never
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      S[M] extends CreateMutationDefinition<S, any>
      ? S
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      S[M] extends UpdateWitArgsMutationDefinition<S, any, infer R>
      ? R
      : S[M] extends UpdateWithoutArgsMutationDefinition<S, infer R>
      ? R
      : never
    : never;
}[StateDefinitionName<S>];
