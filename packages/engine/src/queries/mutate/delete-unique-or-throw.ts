import { State, StateDeleteActions } from '@/generated/index.js';
import { MutateQuery } from './mutate.js';

export class DeleteUniqueOrThrowQuery<
  S extends State,
  K extends StateDeleteActions<S>,
> extends MutateQuery<S, K, never> {}
