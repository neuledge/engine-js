import { StateDefinition, StateDefinitionName } from '../state';
import {
  CreateMutationDefinition,
  CreateWithArgsMutationDefinition,
  CreateWithoutArgsMutationDefinition,
  DeleteMutationDefinition,
  DeleteWithArgsMutationDefinition,
  DeleteWithoutArgsMutationDefinition,
  UpdateWithArgsMutationDefinition,
  UpdateWithoutArgsMutationDefinition,
} from './mutation';

// methods

export type StateDefinitionMethods<S extends StateDefinition> =
  | StateDefinitionInitMethods<S>
  | StateDefinitionAlterMethods<S>;

// init methods

export type StateDefinitionInitMethods<S extends StateDefinition> =
  | StateDefinitionInitWithArgsMethods<S>
  | StateDefinitionInitWithoutArgsMethods<S>;

export type StateDefinitionInitWithArgsMethods<S extends StateDefinition> =
  StateDefinitionCreateWithArgsMethods<S>;

export type StateDefinitionInitWithoutArgsMethods<S extends StateDefinition> =
  StateDefinitionCreateWithoutArgsMethods<S>;

// alter methods

export type StateDefinitionAlterMethods<S extends StateDefinition> =
  | StateDefinitionAlterWithArgsMethods<S>
  | StateDefinitionAlterWithoutArgsMethods<S>;

export type StateDefinitionAlterWithArgsMethods<S extends StateDefinition> =
  | StateDefinitionUpdateWithArgsMethods<S>
  | StateDefinitionDeleteWithArgsMethods<S>;

export type StateDefinitionAlterWithoutArgsMethods<S extends StateDefinition> =
  | StateDefinitionUpdateWithoutArgsMethods<S>
  | StateDefinitionDeleteWithoutArgsMethods<S>;

// create methods

type StateDefinitionCreateWithArgsMethods<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends CreateWithArgsMutationDefinition<S, any>
    ? M
    : never;
}[keyof S];

type StateDefinitionCreateWithoutArgsMethods<S extends StateDefinition> = {
  [M in keyof S]: S[M] extends CreateWithoutArgsMutationDefinition<S>
    ? M
    : never;
}[keyof S];

// update methods

type StateDefinitionUpdateWithArgsMethods<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends UpdateWithArgsMutationDefinition<S, any, any>
    ? M
    : never;
}[keyof S];

type StateDefinitionUpdateWithoutArgsMethods<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends UpdateWithoutArgsMutationDefinition<S, any>
    ? M
    : never;
}[keyof S];

// delete methods

type StateDefinitionDeleteWithArgsMethods<S extends StateDefinition> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [M in keyof S]: S[M] extends DeleteWithArgsMutationDefinition<S, any>
    ? M
    : never;
}[keyof S];

type StateDefinitionDeleteWithoutArgsMethods<S extends StateDefinition> = {
  [M in keyof S]: S[M] extends DeleteWithoutArgsMutationDefinition<S>
    ? M
    : never;
}[keyof S];

// arguments type

export type StateDefinitionMutationArguments<
  S extends StateDefinition,
  M extends keyof S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S[M] extends (this: any, args: infer A) => any
  ? unknown extends A
    ? Record<string, never>
    : A
  : Record<string, never>;

// return state

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
      S[M] extends UpdateWithArgsMutationDefinition<S, any, infer R>
      ? R
      : S[M] extends UpdateWithoutArgsMutationDefinition<S, infer R>
      ? R
      : never
    : never;
}[StateDefinitionName<S>];
