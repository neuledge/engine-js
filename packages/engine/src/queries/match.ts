import {
  StateDefinition,
  StateDefinitionMatchKeys,
  StateDefinitionRelationState,
} from '@/definitions';
import { FilterQuery, FilterQueryOptions } from './filter';

export interface MatchQuery<S extends StateDefinition> {
  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given relation
   * states.
   */
  match<K extends StateDefinitionMatchKeys<S>>(
    key: K,
    states: StateDefinitionRelationState<S, K>[],
  ): this;

  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given relation
   * states and query.
   */
  match<
    K extends StateDefinitionMatchKeys<S>,
    RS extends StateDefinitionRelationState<S, K>,
  >(
    key: K,
    states: RS[],
    query: (query: FilterQuery<RS>) => FilterQuery<RS>,
  ): this;

  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given query.
   */
  match<K extends StateDefinitionMatchKeys<S>>(
    key: K,
    states: null,
    query: (
      query: FilterQuery<StateDefinitionRelationState<S, K>>,
    ) => FilterQuery<StateDefinitionRelationState<S, K>>,
  ): this;
}

export interface MatchQueryOptions<S extends StateDefinition> {
  match?: Match<S>;
}

export type Match<S extends StateDefinition> = {
  [K in StateDefinitionMatchKeys<S>]?: FilterQueryOptions<
    StateDefinitionRelationState<S, K>
  >;
};
