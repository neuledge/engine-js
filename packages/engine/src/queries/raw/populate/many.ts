import { Entity } from '@/entity';
import {
  StateDefinition,
  StateManyRelations,
  StateRelationStates,
} from '@/definitions';
import { Query, QueryMode } from '../../query';
import { QueryEntity, QueryProjection } from '../select';
import { EntityList } from '@/list';
import { SelectManyQuery, SelectManyQueryOptions } from './select-many';

export interface PopulateManyQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> {
  /**
   * Populate and return a one-to-many relation of the entity.
   * Return a list of related entities. If the parent entity has no relation to
   * any entities, the parent entity will be returned with an empty list.
   */
  populateMany<K extends StateManyRelations<O>>(
    key: K,
  ): Query<M, I, O, P, R & PopulateManyQueryResult<O, K>>;

  /**
   * Populate and return a one-to-many relation of the entity.
   * Return a list of related entities that match the given states. If the
   * parent entity has no relation to the given states, the parent entity will
   * be returned with an empty list.
   */
  populateMany<
    K extends StateManyRelations<O>,
    QS extends StateRelationStates<O, K>,
  >(
    key: K,
    states: QS[],
  ): Query<M, I, O, P, R & PopulateManyQueryResult<O, K, Entity<QS>>>;

  /**
   * Query and populate a one-to-many relation of the entity.
   * Return the a list of related entities that match the query. If no related
   * entities match the query, the parent entity will be returned with an empty
   * list.
   */
  populateMany<
    K extends StateManyRelations<O>,
    QP extends QueryProjection<StateRelationStates<O, K>>,
    QR,
  >(
    key: K,
    query: PopulateManyQueryParam<StateRelationStates<O, K>, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R &
      PopulateManyQueryResult<
        O,
        K,
        QueryEntity<StateRelationStates<O, K>, QP, QR>
      >
  >;

  /**
   * Query and populate a one-to-many relation of the entity.
   * Return a list of related entities that match the given states and the
   * query. If no related entities match the query, the parent entity will be
   * returned with an empty list.
   */
  populateMany<
    K extends StateManyRelations<O>,
    QS extends StateRelationStates<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: PopulateManyQueryParam<QS, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R & PopulateManyQueryResult<O, K, QueryEntity<QS, QP, QR>>
  >;
}

export interface PopulateManyQueryOptions<S extends StateDefinition> {
  populateMany?: {
    [K in StateManyRelations<S>]?: SelectManyQueryOptions<
      StateRelationStates<S, K>
    >;
  };
}

export type PopulateManyQueryParam<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> = (
  query: SelectManyQuery<S, true, NonNullable<unknown>>,
) => SelectManyQuery<S, P, R>;

export type PopulateManyQueryResult<
  S extends StateDefinition,
  K extends StateManyRelations<S>,
  T extends Entity<StateDefinition> = Entity<StateRelationStates<S, K>>,
> = { [k in K]: EntityList<T> };
