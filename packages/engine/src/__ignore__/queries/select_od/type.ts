import { Entity, ProjectedEntity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { Category } from '@/generated/__test__/category-post-example.js';
import { EntityList, EntityListOffset } from '@/list.js';
import { Subset } from '../utils.js';
import { UniqueWhere, Where } from '../where.js';
import { Select } from './entity.js.js.js';

export type SelectQuery<
  S extends State,
  R,
  M extends SelectQueryMode,
> = SelectQueries<S, R>[M];

export interface SelectQueries<S extends State, R> {
  FindMany: FindManyQuery<S, R>;
  FindFirst: FindFirstQuery<S, R>;
  FindFirstOrThrow: FindFirstOrThrowQuery<S, R>;
}

export type SelectQueryMode = keyof SelectQueries<never, never>;

export interface FindManyQuery<S extends State, R = Entity<S>>
  extends SelectSelectQuery<S, 'FindMany'>,
    SelectWhereQuery<S, Where<S>>,
    SelectLimitQuery,
    SelectOffsetQuery,
    SelectExecQuery<EntityList<R>> {}

export interface FindFirstQuery<S extends State, R = Entity<S>>
  extends SelectSelectQuery<S, 'FindFirst'>,
    SelectWhereQuery<S, Where<S>>,
    SelectOffsetQuery,
    SelectExecQuery<R | undefined> {}

export interface FindFirstOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectSelectQuery<S, 'FindFirstOrThrow'>,
    SelectWhereQuery<S, Where<S>>,
    SelectOffsetQuery,
    SelectExecQuery<R> {}

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
