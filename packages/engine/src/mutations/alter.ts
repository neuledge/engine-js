import {
  StateDefinition,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
  StateDefinitionAlterWithArgsMutations,
  StateDefinitionAlterWithoutArgsMutations,
} from '@/definitions';
import {
  AlterFirstOrThrowQuery,
  AlterFirstQuery,
  AlterManyQuery,
  AlterUniqueOrThrowQuery,
  AlterUniqueQuery,
} from '@/queries';

export type AlterManyMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMutations<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterManyQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterFirstMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMutations<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterFirstOrThrowMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMutations<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterFirstOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterUniqueMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMutations<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueQuery<S, StateDefinitionMutationsReturn<S, M>>;
};

export type AlterUniqueOrThrowMutation<S extends StateDefinition> = {
  [M in StateDefinitionAlterWithoutArgsMutations<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
} & {
  [M in StateDefinitionAlterWithArgsMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => AlterUniqueOrThrowQuery<S, StateDefinitionMutationsReturn<S, M>>;
};
