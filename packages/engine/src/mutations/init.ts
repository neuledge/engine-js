import {
  StateDefinition,
  StateDefinitionInitWithArgsMethods,
  StateDefinitionInitWithoutArgsMethods,
  StateDefinitionMutationArguments,
} from '@/definitions';
import { InitManyQuery, InitOneQuery } from '@/queries';

export type InitManyMutation<S extends StateDefinition> = {
  [M in StateDefinitionInitWithArgsMethods<S>]: (
    ...args: StateDefinitionMutationArguments<S, M>[]
  ) => InitManyQuery<S>;
} & {
  [M in StateDefinitionInitWithoutArgsMethods<S>]:
    | ((...args: StateDefinitionMutationArguments<S, M>[]) => InitManyQuery<S>)
    | ((count: number) => InitManyQuery<S>);
};

export type InitOneMutation<S extends StateDefinition> = {
  [M in StateDefinitionInitWithArgsMethods<S>]: (
    args: StateDefinitionMutationArguments<S, M>,
  ) => InitOneQuery<S>;
} & {
  [M in StateDefinitionInitWithoutArgsMethods<S>]: (
    args?: StateDefinitionMutationArguments<S, M>,
  ) => InitOneQuery<S>;
};
