import { State, StateDeleteMethods } from '@/generated/index.js';
import { SelectManyLogic } from '../select/index.js';
import { Where } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class DeleteManyQuery<
  S extends State,
  K extends StateDeleteMethods<S>,
> extends MutateQuery<S, K, never, SelectManyLogic, Where<S>, number> {
  constructor(states: S[], action: K) {
    super(states, action, [], MutateSelectQuery.prototype.many);
  }
}
