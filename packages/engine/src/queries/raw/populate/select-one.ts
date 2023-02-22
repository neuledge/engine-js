import { StateDefinition } from '@/definitions';
import { ChildQueryOptions } from '../type';
import { QueryProjection, SelectQuery, SelectQueryOptions } from '../select';
import { PopulateQuery, PopulateQueryOptions } from './populate';
import { ExpandQuery, ExpandQueryOptions } from './expand';
import { FilterQuery, FilterQueryOptions } from '../filter';

export interface SelectOneQuery<
  S extends StateDefinition,
  P extends QueryProjection<S>,
  R,
> extends SelectQuery<'SelectOne', S, S, R>,
    ExpandQuery<'SelectOne', S, S, P, R>,
    PopulateQuery<'SelectOne', S, S, P, R>,
    FilterQuery<S> {}

export interface SelectOneQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'SelectOne', S>,
    SelectQueryOptions<S>,
    ExpandQueryOptions<S>,
    PopulateQueryOptions<S>,
    FilterQueryOptions<S> {}
