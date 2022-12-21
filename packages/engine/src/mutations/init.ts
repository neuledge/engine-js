import {
  StateDefinition,
  StateDefinitionCreateMutations,
  StateDefinitionMutationArguments,
} from '@/definitions';
import { InitManyQuery, InitOneQuery } from '@/queries';

export type InitManyMutation<S extends StateDefinition> = {
  [M in StateDefinitionCreateMutations<S>]: (
    ...args: StateDefinitionMutationArguments<S, M>[]
  ) => InitManyQuery<S>;
};

export type InitOneMutation<S extends StateDefinition> = {
  [M in StateDefinitionCreateMutations<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => InitOneQuery<S>;
};
