import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';
import { FindFirstOrThrowLogic } from './logic.js';

export class FindUniqueOrThrowQuery<S extends State> extends FindQuery<
  S,
  FindFirstOrThrowLogic,
  Entity<S>,
  Where<S>,
  1,
  never
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.firstOrThrow);
    this._limit = 1;
  }
}
