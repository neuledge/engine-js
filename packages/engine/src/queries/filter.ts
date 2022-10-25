import {
  State,
  StateFilterKeys,
  StateRelationState,
} from '@/generated/index.js';
import { Where } from './where.js';

export interface FilterQuery<S extends State> extends BasicFilterQuery<S> {
  where(where: Where<S> | null): this;
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
