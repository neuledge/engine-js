import {
  State,
  StateFilterKeys,
  StateRelationState,
} from '@/generated/index.js';
import { QueryMode } from './query.js';
import { Query } from './query.js';
import { UniqueWhere, Where } from './where.js';

export interface FilterQuery<S extends State> extends BasicFilterQuery<S> {
  where(where: Where<S> | null): this;
}

export interface UniqueFilterQuery<
  M extends QueryMode,
  I extends State,
  O extends State,
  R,
> extends BasicFilterQuery<I> {
  where(where: UniqueWhere<I>): Query<M, I, O, R>;
}

interface BasicFilterQuery<S extends State> {
  filter<K extends StateFilterKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: RS[],
  ): this;
  filter<K extends StateFilterKeys<S>, RS extends StateRelationState<S, K>>(
    key: K,
    states: RS[],
    query: (query: FilterQuery<RS>) => FilterQuery<RS>,
  ): this;
}
