import { State, StateDeleteMethods } from '@/generated/index.js';
import { SelectFirstLogic } from '../select/index.js';
import { UniqueWhere } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class DeleteUniqueQuery<
  S extends State,
  K extends StateDeleteMethods<S>,
> extends MutateQuery<S, K, never, SelectFirstLogic, UniqueWhere<S>, 1> {
  constructor(states: S[], action: K) {
    super(states, action, [], MutateSelectQuery.prototype.first);
  }
}