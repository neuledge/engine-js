import {
  StateDefinition,
  StateDefinitionMatchKeys,
  StateDefinitionRelationState,
} from '@/definitions';
import { FilterQuery, FilterQueryOptions } from './filter';
import { ChildQueryOptions } from './type';

export type MatchQuery<S extends StateDefinition> = FilterQuery<S>;

export interface MatchQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'Match', S>,
    FilterQueryOptions<S> {}

export type Match<S extends StateDefinition> = {
  [K in StateDefinitionMatchKeys<S>]?: MatchQueryOptions<
    StateDefinitionRelationState<S, K>
  >;
};
