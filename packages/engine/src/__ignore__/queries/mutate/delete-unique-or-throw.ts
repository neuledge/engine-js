import { State, StateDeleteMethods } from '@/generated/index.js';
import { SelectFirstOrThrowLogic } from '../select/index.js';
import { UniqueWhere } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class DeleteUniqueOrThrowQuery<
  S extends State,
  K extends StateDeleteMethods<S>,
> extends MutateQuery<S, K, never, SelectFirstOrThrowLogic, UniqueWhere<S>, 1> {
  constructor(states: S[], action: K) {
    super(states, action, [], MutateSelectQuery.prototype.firstOrThrow);
  }
}
