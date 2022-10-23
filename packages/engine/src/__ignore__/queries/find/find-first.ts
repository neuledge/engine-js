import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { SelectFirstLogic } from '../select/index.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';

export class FindFirstQuery<S extends State> extends FindQuery<
  S,
  SelectFirstLogic,
  Entity<S>,
  Where<S>,
  1,
  EntityListOffset
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.first);
    this._limit = 1;
  }
}
