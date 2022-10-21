import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';
import { FindFirstLogic } from './logic.js';

export class FindUniqueQuery<S extends State> extends FindQuery<
  S,
  FindFirstLogic,
  Entity<S>,
  Where<S>,
  1,
  never
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.first);
    this._limit = 1;
  }
}
