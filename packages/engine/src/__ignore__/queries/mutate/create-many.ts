import {
  State,
  StateMethodArguments,
  StateCreateMethods,
} from '@/generated/index.js';
import { SelectManyLogic } from '../select/index.js';
import { Where } from '../where.js';
import { MutateQuery } from './mutate.js';
import { MutateSelectQuery } from './select.js';

export class CreateManyQuery<
  S extends State,
  K extends StateCreateMethods<S>,
  A extends StateMethodArguments<S, K>,
> extends MutateQuery<S, K, A, SelectManyLogic, Where<S>, never> {
  constructor(states: S[], action: K, ...args: A[]) {
    super(states, action, args, MutateSelectQuery.prototype.many);
  }
}
