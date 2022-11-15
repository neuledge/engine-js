import {
  State,
  StateMatchKeys,
  StateRelationState,
} from '@/generated/index.js';
import { Match, MatchQuery } from './match.js';
import { Where } from './where.js';

export interface FilterQuery<S extends State> {
  where(where: Where<S> | null): this;

  match<K extends StateMatchKeys<S>>(
    key: K,
    states: StateRelationState<S, K>[],
  ): this;
  match<K extends StateMatchKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: RS[],
    query: (query: MatchQuery<RS>) => MatchQuery<RS>,
  ): this;
  match<K extends StateMatchKeys<S>>(
    key: K,
    states: null,
    query: (
      query: MatchQuery<StateRelationState<S, K>>,
    ) => MatchQuery<StateRelationState<S, K>>,
  ): this;
}

export interface FilterQueryOptions<S extends State> {
  where?: Where<S>;
  match?: Match<S>;
}
