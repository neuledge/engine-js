import { StateDefinition } from '@/definitions';
import { ChildQueryOptions } from '../type';
import { WhereQuery, WhereQueryOptions } from '../where';
import { MatchQuery, MatchQueryOptions } from '../match/match';
import { QueryProjection, SelectQuery, SelectQueryOptions } from '../select';
import { PopulateQuery, PopulateQueryOptions } from './populate';

export interface SelectOneQuery<
  S extends StateDefinition,
  P extends QueryProjection<S>,
  R,
> extends SelectQuery<'SelectOne', S, S, R>,
    PopulateQuery<'SelectOne', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S> {}

export interface SelectOneQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'SelectOne', S>,
    SelectQueryOptions<S>,
    PopulateQueryOptions<S>,
    WhereQueryOptions<S>,
    MatchQueryOptions<S> {}
