import { State } from '@/generated/index.js';
import { Subset } from '../utils.js';
import { UniqueWhere, Where } from '../where.js';
import { SelectQueryMode } from './mode.js.js.js';
import { Select } from './state.js.js';

export interface SelectSelectQuery<S extends State, M extends SelectQueryMode> {
  select<P extends Select<S>>(
    select: Subset<P, Select<S>>,
  ): SelectQuery<S, ProjectedEntity<S, P>, M>;
}

export interface SelectWhereQuery<
  S extends State,
  W extends Where<S> | UniqueWhere<S>,
> {
  where(where: W | null): this;
}

export interface SelectLimitQuery {
  limit(limit: number | null): this;
}

export interface SelectOffsetQuery {
  offset(offset: EntityListOffset | null): this;
}

export interface SelectExecQuery<T> {
  exec(): Promise<T>;
  then: Promise<T>['then'];
}
