import {
  State,
  StateMutationArguments,
  StateMutations,
} from '@/generated/index.js';

export interface MethodQueryOptions<M extends string | number | symbol> {
  method: M;
}

export interface SingleArgsQueryOptions<
  I extends State,
  M extends StateMutations<I>,
> extends MethodQueryOptions<M> {
  args: [StateMutationArguments<I, M>];
}

export interface MultiArgsQueryOptions<
  I extends State,
  M extends StateMutations<I>,
> extends MethodQueryOptions<M> {
  args: StateMutationArguments<I, M>[];
}
