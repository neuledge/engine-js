import {
  StateAllRelations,
  StateDefinition,
  StateRelationStates,
} from '@/definitions';
import { RefineQuery, RefineQueryOptions } from './refine';

export interface MatchQuery<S extends StateDefinition> {
  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given relation
   * states.
   */
  match<K extends StateAllRelations<S>>(
    key: K,
    states: StateRelationStates<S, K>[],
  ): this;

  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given query.
   */
  match<K extends StateAllRelations<S>>(
    key: K,
    query: MatchQueryParam<StateRelationStates<S, K>>,
  ): this;

  /**
   * Filter the returned entities by relation.
   * Return only entities with a related entity that matches the given relation
   * states and query.
   */
  match<K extends StateAllRelations<S>, RS extends StateRelationStates<S, K>>(
    key: K,
    states: RS[],
    query: MatchQueryParam<RS>,
  ): this;
}

export interface MatchQueryOptions<S extends StateDefinition> {
  match?: {
    [K in StateAllRelations<S>]?: RefineQueryOptions<StateRelationStates<S, K>>;
  };
}

export type MatchQueryParam<S extends StateDefinition> = (
  query: RefineQuery<S>,
) => RefineQuery<S>;
