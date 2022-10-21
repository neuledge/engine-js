import { State, StateDeleteActions } from '@/generated/index.js';
import { MutateQuery } from './mutate.js';

export class DeleteUniqueQuery<
  S extends State,
  K extends StateDeleteActions<S>,
> extends MutateQuery<S, K, never> {}
