import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { SelectFirstLogic } from '../select/index.js';
import { UniqueWhere } from '../where.js';
import { FindQuery } from './find.js';

export class FindUniqueQuery<S extends State> {
  constructor(protected readonly states: S[]) {}

  where(where: UniqueWhere<S>): FindUniqueWhereQuery<S> {
    return new FindUniqueWhereQuery(this.states, where);
  }
}

export class FindUniqueWhereQuery<S extends State> extends FindQuery<
  S,
  SelectFirstLogic,
  Entity<S>,
  UniqueWhere<S>,
  1,
  never
> {
  protected _where: UniqueWhere<S>;

  constructor(states: S[], where: UniqueWhere<S>) {
    super(states, FindQuery.prototype.first);
    this._limit = 1;
    this._where = where;
  }

  where(where: UniqueWhere<S>): this {
    return super.where(where);
  }
}
