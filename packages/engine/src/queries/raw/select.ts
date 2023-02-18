import { StateDefinition, StateType } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { Query, QueryMode } from '../query';
import { Merge, Subset } from './utils';

export interface SelectQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R = NonNullable<unknown>,
> {
  /**
   * Select and return all properties of the entity.
   * The return type will be the entity itself.
   */
  select(select?: true): Query<M, I, O, true, R>;

  /**
   * Select and return a subset of the entity's properties.
   * The return type will be a projected entity.
   */
  select<P extends Select<O>>(select: SelectParam<O, P>): Query<M, I, O, P, R>;
}

export interface SelectQueryOptions<
  S extends StateDefinition,
  P extends Select<S> = Select<S>,
> {
  select?: P | true | null;
}

export type Select<S extends StateDefinition> = {
  [K in keyof Merge<StateType<S>>]?: boolean;
};

export type SelectParam<
  S extends StateDefinition,
  P extends Select<S>,
> = Subset<P, Select<S>>;

export type QueryProjection<S extends StateDefinition> =
  | Select<S>
  | true
  | null;

export type QueryEntity<
  S extends StateDefinition,
  P extends QueryProjection<S>,
  R,
> = (P extends Select<S> ? ProjectedEntity<S, P> : Entity<S>) & R;
