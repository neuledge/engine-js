import {
  State,
  StateMethodArguments,
  StateCreateMethods,
} from '@/generated/index.js';
import { SelectFirstLogic } from '../select/index.js';
import { Where } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class CreateOneQuery<
  S extends State,
  K extends StateCreateMethods<S>,
  A extends StateMethodArguments<S, K>,
> extends MutateQuery<S, K, A, SelectFirstLogic, Where<S>, 1> {
  constructor(states: S[], action: K, args: A) {
    super(states, action, [args], MutateSelectQuery.prototype.first);
    this._limit = 1;
  }
}
