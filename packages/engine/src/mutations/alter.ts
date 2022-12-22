import {
  StateDefinition,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionAlterWithArgsMethods,
  StateDefinitionAlterWithoutArgsMethods,
} from '@/definitions';
import {
  AlterFirstOrThrowQuery,
  AlterFirstQuery,
  AlterManyQuery,
  AlterUniqueOrThrowQuery,
  AlterUniqueQuery,
} from '@/queries';

export type AlterManyMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterFirstMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterFirstOrThrowMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterUniqueMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterUniqueOrThrowMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
};
