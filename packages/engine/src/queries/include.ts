import { Entity } from '@/entity';
import {
  StateDefinition,
  StateDefinitionIncludeManyKeys,
  StateDefinitionIncludeOneKeys,
  StateDefinitionRelationState,
} from '@/definitions';
import { Query, QueryMode } from './query';
import { EntityList } from '@/list';
import { SelectManyQuery, SelectManyQueryOptions } from './select-many';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';
import { QueryEntity, QueryProjection } from './select';

// This query is very similar to `RequireQuery`. If you make changes here, you
// probably want to make the same changes there.

export interface IncludeQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true, // projection
  R = NonNullable<unknown>, // relations
> {
  /**
   * Include a one-to-many relation in the query.
   */
  includeMany<K extends StateDefinitionIncludeManyKeys<O>>(
    key: K,
  ): Query<
    M,
    I,
    O,
    P,
    R & { [k in K]: EntityList<Entity<StateDefinitionRelationState<O, K>>> }
  >;

  /**
   * Choose only a specific states from a one-to-many relation, and include all
   * the matching states in the query.
   */
  includeMany<
    K extends StateDefinitionIncludeManyKeys<O>,
    RS extends StateDefinitionRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, P, R & { [k in K]: EntityList<Entity<RS>> }>;

  /**
   * Query a one-to-many relation and include the matching entities in the
   * query.
   */
  includeMany<
    K extends StateDefinitionIncludeManyKeys<O>,
    QP extends QueryProjection<StateDefinitionRelationState<O, K>>,
    QR,
  >(
    key: K,
    states: null,
    query: (
      query: SelectManyQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectManyQuery<StateDefinitionRelationState<O, K>, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R & {
      [k in K]: EntityList<
        QueryEntity<StateDefinitionRelationState<O, K>, QP, QR>
      >;
    }
  >;

  /**
   * Choose only a specific states from a one-to-many relation, query and
   * include the matching entities in the query.
   */
  includeMany<
    K extends StateDefinitionIncludeManyKeys<O>,
    QS extends StateDefinitionRelationState<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: (query: SelectManyQuery<QS>) => SelectManyQuery<QS, QP, QR>,
  ): Query<M, I, O, P, R & { [k in K]: EntityList<QueryEntity<QS, QP, QR>> }>;

  /**
   * Include a one-to-one relation in the query.
   * If no entity matches, the relation will be null.
   */
  includeOne<K extends StateDefinitionIncludeOneKeys<O>>(
    key: K,
  ): Query<
    M,
    I,
    O,
    P,
    R & { [k in K]?: Entity<StateDefinitionRelationState<O, K>> | null }
  >;

  /**
   * Choose only a specific state from a one-to-one relation, and include the
   * matching states in the query. If no state matches, the relation will be
   * null.
   */
  includeOne<
    K extends StateDefinitionIncludeOneKeys<O>,
    RS extends StateDefinitionRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, P, R & { [k in K]?: Entity<RS> | null }>;

  /**
   * Query a one-to-one relation and include the matching entity in the query.
   * If no entity matches, the relation will be null.
   */
  includeOne<
    K extends StateDefinitionIncludeOneKeys<O>,
    QP extends QueryProjection<StateDefinitionRelationState<O, K>>,
    QR,
  >(
    key: K,
    states: null,
    query: (
      rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectOneQuery<StateDefinitionRelationState<O, K>, QP, QR>,
  ): Query<
    M,
    I,
    O,
    P,
    R & {
      [k in K]?: QueryEntity<StateDefinitionRelationState<O, K>, QP, QR> | null;
    }
  >;

  /**
   * Choose only specific states from a one-to-one relation, query and
   * include the matching entity in the query. If no entity matches, the
   * relation will be null.
   */
  includeOne<
    K extends StateDefinitionIncludeOneKeys<O>,
    QS extends StateDefinitionRelationState<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: (rel: SelectOneQuery<QS>) => SelectOneQuery<QS, QP, QR>,
  ): Query<M, I, O, P, R & { [k in K]?: QueryEntity<QS, QP, QR> | null }>;
}

export interface IncludeQueryOptions<S extends StateDefinition> {
  includeMany?: {
    [K in StateDefinitionIncludeManyKeys<S>]?: SelectManyQueryOptions<
      StateDefinitionRelationState<S, K>,
      StateDefinitionRelationState<S, K>
    >;
  };
  includeOne?: {
    [K in StateDefinitionIncludeOneKeys<S>]?: SelectOneQueryOptions<
      StateDefinitionRelationState<S, K>,
      StateDefinitionRelationState<S, K>
    >;
  };
}
