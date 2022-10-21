import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';
import { FindManyLogic } from './logic.js';

export class FindManyQuery<S extends State> extends FindQuery<
  S,
  FindManyLogic,
  Entity<S>,
  Where<S>,
  number,
  EntityListOffset
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.many);
  }
}
