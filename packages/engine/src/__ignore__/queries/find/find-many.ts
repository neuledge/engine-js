import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { SelectManyLogic } from '../select/index.js';
import { Where } from '../where.js';
import { FindQuery } from './find.js';

export class FindManyQuery<S extends State> extends FindQuery<
  S,
  SelectManyLogic,
  Entity<S>,
  Where<S>,
  number,
  EntityListOffset
> {
  constructor(states: S[]) {
    super(states, FindQuery.prototype.many);
  }
}
