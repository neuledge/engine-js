import {
  State,
  StateFilterKeys,
  StateRelationState,
} from '@/generated/index.js';
import { TypeQueryOptions } from './type.js';
import { Where } from './where.js';

export interface FilterQuery<S extends State> {
  where(where: Where<S> | null): this;

  filter<K extends StateFilterKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: RS[],
  ): this;
  filter<K extends StateFilterKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: RS[],
    query: (query: FilterQuery<RS>) => FilterQuery<RS>,
  ): this;
  filter<K extends StateFilterKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: null,
    query: (query: FilterQuery<RS>) => FilterQuery<RS>,
  ): this;
}

export interface FilterQueryOptions<S extends State> {
  where?: Where<S>;
  filter?: {
    [K in StateFilterKeys<S>]?: FilterQueryOptions<StateRelationState<S, K>>;
  };
}

export interface FilterOnlyQueryOptions<S extends State>
  extends TypeQueryOptions<'Filter', S>,
    FilterQueryOptions<S> {}
