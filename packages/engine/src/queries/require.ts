import { Entity } from '@/entity';
import {
  StateDefinition,
  StateDefinitionRelationState,
  StateDefinitionRequireOneKeys,
} from '@/definitions';
import { Query, QueryMode } from './query';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';

export interface RequireQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R,
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
    RS extends StateDefinitionRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, R & { [k in K]: Entity<RS> }>;

  /**
   * Query a one-to-one relation and require the matching entity in the query.
   * If no entity matches, the parent entity will be excluded from the result
   * and an error may be thrown, depending on the query mode.
   */
  requireOne<K extends StateDefinitionRequireOneKeys<O>, RR>(
    key: K,
    states: null,
    query: (
      rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectOneQuery<StateDefinitionRelationState<O, K>, RR>,
  ): Query<M, I, O, R & { [k in K]: RR }>;

  /**
   * Choose only specific states from a one-to-one relation, query and
   * require the matching entity in the query. If no entity matches, the
   * parent entity will be excluded from the result and an error may be
   * thrown, depending on the query mode.
   */
  requireOne<
    K extends StateDefinitionRequireOneKeys<O>,
    RS extends StateDefinitionRelationState<O, K>,
    RR,
  >(
    key: K,
    states: RS[],
    query: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  ): Query<M, I, O, R & { [k in K]: RR }>;
}

export interface RequireQueryOptions<S extends StateDefinition> {
  requireOne?: {
    [K in StateDefinitionRequireOneKeys<S>]?: SelectOneQueryOptions<
      StateDefinitionRelationState<S, K>,
      StateDefinitionRelationState<S, K>
    >;
  };
}
