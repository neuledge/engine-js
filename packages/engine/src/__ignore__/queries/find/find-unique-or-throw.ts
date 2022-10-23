import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { SelectFirstOrThrowLogic } from '../select/index.js';
import { UniqueWhere } from '../where.js';
import { FindQuery } from './find.js';

export class FindUniqueOrThrowQuery<S extends State> {
  constructor(protected readonly states: S[]) {}

  where(where: UniqueWhere<S>): FindUniqueOrThrowWhereQuery<S> {
    return new FindUniqueOrThrowWhereQuery(this.states, where);
  }
}

export class FindUniqueOrThrowWhereQuery<S extends State> extends FindQuery<
  S,
  SelectFirstOrThrowLogic,
  Entity<S>,
  UniqueWhere<S>,
  1,
  never
> {
  protected _where: UniqueWhere<S>;

  constructor(states: S[], where: UniqueWhere<S>) {
    super(states, FindQuery.prototype.firstOrThrow);
    this._limit = 1;
    this._where = where;
  }

  where(where: UniqueWhere<S>): this {
    return super.where(where);
  }
}
