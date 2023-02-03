import { Entity } from '@/entity';
import {
  StateDefinition,
  StateDefinitionRelationState,
  StateDefinitionRequireOneKeys,
} from '@/definitions';
import { Query, QueryMode } from './query';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';
import { QueryEntity, QueryProjection } from './select';

// This query is very similar to `IncludeQuery`. If you make changes here, you
// probably want to make the same changes there.

export interface RequireQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> {
  /**
   * Require a one-to-many relation in the query.
   * If no entity matches, the the parent entity will be excluded from the
   * result and an error may be thrown, depending on the query mode.
   */
  requireOne<K extends StateDefinitionRequireOneKeys<O>>(
    key: K,
  ): Query<
    M,
    I,
    O,
    P,
    R & { [k in K]: Entity<StateDefinitionRelationState<O, K>> }
  >;

  /**
   * Choose only specific states from a one-to-one relation, and require the
   * matching states in the query. If no state matches, the parent entity will
   * be excluded from the result and an error may be thrown, depending on the
   * query mode.
   */
  requireOne<
    K extends StateDefinitionRequireOneKeys<O>,
    QS extends StateDefinitionRelationState<O, K>,
  >(
    key: K,
    states: QS[],
  ): Query<M, I, O, P, R & { [k in K]: Entity<QS> }>;

  /**
   * Query a one-to-one relation and require the matching entity in the query.
   * If no entity matches, the parent entity will be excluded from the result
   * and an error may be thrown, depending on the query mode.
   */
  requireOne<
    K extends StateDefinitionRequireOneKeys<O>,
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
    R & { [k in K]: QueryEntity<StateDefinitionRelationState<O, K>, QP, QR> }
  >;

  /**
   * Choose only specific states from a one-to-one relation, query and
   * require the matching entity in the query. If no entity matches, the
   * parent entity will be excluded from the result and an error may be
   * thrown, depending on the query mode.
   */
  requireOne<
    K extends StateDefinitionRequireOneKeys<O>,
    QS extends StateDefinitionRelationState<O, K>,
    QP extends QueryProjection<QS>,
    QR,
  >(
    key: K,
    states: QS[],
    query: (rel: SelectOneQuery<QS>) => SelectOneQuery<QS, QP, QR>,
  ): Query<M, I, O, P, R & { [k in K]: QueryEntity<QS, QP, QR> }>;
}

export interface RequireQueryOptions<S extends StateDefinition> {
  requireOne?: {
    [K in StateDefinitionRequireOneKeys<S>]?: SelectOneQueryOptions<
      StateDefinitionRelationState<S, K>,
      StateDefinitionRelationState<S, K>
    >;
  };
}
