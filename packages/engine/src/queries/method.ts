import {
  StateDefinition,
  StateDefinitionMutationArguments,
  StateDefinitionMethods,
} from '@/definitions';

export interface MethodQueryOptions<M extends string | number | symbol> {
  method: M;
}

export interface SingleArgsQueryOptions<
  I extends StateDefinition,
  M extends StateDefinitionMethods<I>,
> extends MethodQueryOptions<M> {
  args: [StateDefinitionMutationArguments<I, M>];
}

export interface MultiArgsQueryOptions<
  I extends StateDefinition,
  M extends StateDefinitionMethods<I>,
> extends MethodQueryOptions<M> {
  args: StateDefinitionMutationArguments<I, M>[];
}
