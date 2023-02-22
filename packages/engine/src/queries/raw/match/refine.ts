import { StateDefinition } from '@/definitions';
import { MatchQuery, MatchQueryOptions } from './match';
import { ChildQueryOptions } from '../type';
import { FilterQuery, FilterQueryOptions } from '../filter';

export interface RefineQuery<S extends StateDefinition>
  extends FilterQuery<S>,
    MatchQuery<S> {}

export interface RefineQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'Refine', S>,
    FilterQueryOptions<S>,
    MatchQueryOptions<S> {}
