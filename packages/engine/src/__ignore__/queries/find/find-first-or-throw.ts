import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { SelectFirstOrThrowLogic } from '../select/index.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';

export class FindFirstOrThrowQuery<S extends State> extends FindQuery<
  S,
  SelectFirstOrThrowLogic,
  Entity<S>,
  Where<S>,
  1,
  EntityListOffset
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.firstOrThrow);
    this._limit = 1;
  }
}
