import {
  StateDefinition,
  StateDefinitionMatchKeys,
  StateDefinitionRelationState,
} from '@/definitions/index.js';
import { Match, MatchQuery } from './match.js';
import { Where } from './where.js';

export interface FilterQuery<S extends StateDefinition> {
  where(where: Where<S> | null): this;

  match<K extends StateDefinitionMatchKeys<S>>(
    key: K,
    states: StateDefinitionRelationState<S, K>[],
  ): this;
  match<
    K extends StateDefinitionMatchKeys<S>,
    RS extends StateDefinitionRelationState<S, K>,
  >(
    key: K,
    states: RS[],
    query: (query: MatchQuery<RS>) => MatchQuery<RS>,
  ): this;
  match<K extends StateDefinitionMatchKeys<S>>(
    key: K,
    states: null,
    query: (
      query: MatchQuery<StateDefinitionRelationState<S, K>>,
    ) => MatchQuery<StateDefinitionRelationState<S, K>>,
  ): this;
}

export interface FilterQueryOptions<S extends StateDefinition> {
  where?: Where<S>;
  match?: Match<S>;
}
