import {
  State,
  StateMatchKeys,
  StateRelationState,
} from '@/generated/index.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { ChildQueryOptions } from './type.js';

export type MatchQuery<S extends State> = FilterQuery<S>;

export interface MatchQueryOptions<S extends State>
  extends ChildQueryOptions<'Match', S>,
    FilterQueryOptions<S> {}

export type Match<S extends State> = {
  [K in StateMatchKeys<S>]?: MatchQueryOptions<StateRelationState<S, K>>;
};
