import { Entity } from '@/entity';
import {
  StateDefinition,
  StateOneRelations,
  StateRelationStates,
  StateType,
} from '@/definitions';
import { Query, QueryMode } from '../../query';
import { QueryEntity, QueryProjection } from '../select';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';

export interface ExpandQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R = NonNullable<unknown>,
> {
  /**
   * Expand and return a relation of a single entity.
   * If the relation is optional, the relation will be returned as an entity or
   * null.
   */
  expand<K extends StateOneRelations<O>>(
    key: K,
  ): Query<M, I, O, P, R & ExpandQueryResult<O, K>>;

  /**
   * Expand and return a relation of a single entity.
   * Filter and return parent entities that have a relation to the given related
   * states.
   */
  expand<K extends StateOneRelations<O>, QS extends StateRelationStates<O, K>>(
    key: K,
    states: QS[],
  ): Query<M, I, O, P, R & { [k in K]: Entity<QS> }>;

  /**
   * Query and expand a relation of a single entity.
   * Any filter applied to the query will be applied to the parent entity as
   * well and the parent entity will be returned if the relation matches the
   * query. If no `.select()` is applied to the query, the relation will not be
   * returned and only filter the parent entity.
   */
  expand<
    K extends StateOneRelations<O>,
    QP extends QueryProjection<StateRelationStates<O, K>>,
    QR,
  >(
    key: K,
    query: ExpandQueryParam<StateRelationStates<O, K>, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    QP extends null
      ? R
      : R &
          ExpandQueryResult<
            O,
            K,
            QueryEntity<StateRelationStates<O, K>, QP, QR>
          >
  >;

  /**
   * Query and expand a relation of a single entity.
   * Filter and return parent entities that have a relation to the given related
   * states. Any filter applied to the query will be applied to the parent
   * entity as well and the parent entity will be returned if the relation
   * matches the query. If no `.select()` is applied to the query, the relation
   * will not be returned and only filter the parent entity.
   */
  expand<
    K extends StateOneRelations<O>,
    QS extends StateRelationStates<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: ExpandQueryParam<QS, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    QP extends null ? R : R & { [k in K]: QueryEntity<QS, QP, QR> }
  >;
}

export interface ExpandQueryOptions<S extends StateDefinition> {
  expand?: {
    [K in StateOneRelations<S>]?: SelectOneQueryOptions<
      StateRelationStates<S, K>
    >;
  };
}

export type ExpandQueryParam<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> = (
  query: SelectOneQuery<S, null, NonNullable<unknown>>,
) => SelectOneQuery<S, P, R>;

export type ExpandQueryResult<
  S extends StateDefinition,
  K extends StateOneRelations<S>,
  T extends Entity<StateDefinition> = Entity<StateRelationStates<S, K>>,
> = undefined extends StateType<S>[K]
  ? { [k in K]?: T | null }
  : { [k in K]: T };
