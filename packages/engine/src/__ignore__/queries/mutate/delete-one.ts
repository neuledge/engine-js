import { State, StateDeleteMethods } from '@/generated/index.js';
import { SelectFirstLogic } from '../select/index.js';
import { Where } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class DeleteOneQuery<
  S extends State,
  K extends StateDeleteMethods<S>,
> extends MutateQuery<S, K, never, SelectFirstLogic, Where<S>, 1> {
  constructor(states: S[], action: K) {
    super(states, action, [], MutateSelectQuery.prototype.first);
  }
}
