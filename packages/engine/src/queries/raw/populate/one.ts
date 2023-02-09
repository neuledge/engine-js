import { Entity } from '@/entity';
import {
  StateDefinition,
  StateOneRelations,
  StateRelationStates,
} from '@/definitions';
import { Query, QueryMode } from '../../query';
import { QueryEntity, QueryProjection } from '../select';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';

export interface PopulateOneQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> {
  /**
   * Populate and return a relation of the entity.
   * Return the related entity. A null relation will be returned if the parent
   * entity has no relation.
   */
  populateOne<K extends StateOneRelations<O>>(
    key: K,
  ): Query<M, I, O, P, R & PopulateOneQueryResult<O, K>>;

  /**
   * Populate and return a relation of the entity.
   * Return the related entity that match the given states. If the parent entity
   * has no relation to the given states, the parent entity will be returned
   * with a null relation.
   */
  populateOne<
    K extends StateOneRelations<O>,
    QS extends StateRelationStates<O, K>,
  >(
    key: K,
    states: QS[],
  ): Query<M, I, O, P, R & PopulateOneQueryResult<O, K, Entity<QS>>>;

  /**
   * Query and populate a relation of the entity.
   * Return the related entity that match the query. If the related entity
   * doesn't match the query, the parent entity will be returned with a null
   * relation.
   */
  populateOne<
    K extends StateOneRelations<O>,
    QP extends QueryProjection<StateRelationStates<O, K>>,
    QR,
  >(
    key: K,
    query: PopulateOneQueryParam<StateRelationStates<O, K>, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R &
      PopulateOneQueryResult<
        O,
        K,
        QueryEntity<StateRelationStates<O, K>, QP, QR>
      >
  >;

  /**
   * Query and populate a relation of the entity.
   * Return the related entity that match the given states and the query. If the
   * related entity doesn't match the query, the parent entity will be returned
   * with a null relation.
   */
  populateOne<
    K extends StateOneRelations<O>,
    QS extends StateRelationStates<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: PopulateOneQueryParam<QS, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R & PopulateOneQueryResult<O, K, QueryEntity<QS, QP, QR>>
  >;
}

export interface PopulateOneQueryOptions<S extends StateDefinition> {
  populateOne?: {
    [K in StateOneRelations<S>]?: SelectOneQueryOptions<
      StateRelationStates<S, K>
    >;
  };
}

export type PopulateOneQueryParam<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> = (
  query: SelectOneQuery<S, true, NonNullable<unknown>>,
) => SelectOneQuery<S, P, R>;

export type PopulateOneQueryResult<
  S extends StateDefinition,
  K extends StateOneRelations<S>,
  T extends Entity<StateDefinition> = Entity<StateRelationStates<S, K>>,
> = { [k in K]?: T | null };
