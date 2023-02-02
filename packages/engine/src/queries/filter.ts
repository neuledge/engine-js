import { StateDefinition } from '@/definitions';
import { MatchQuery, MatchQueryOptions } from './match';
import { ChildQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';

export interface FilterQuery<S extends StateDefinition>
  extends WhereQuery<S>,
    MatchQuery<S> {}

export interface FilterQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'Filter', S>,
    WhereQueryOptions<S>,
    MatchQueryOptions<S> {}
