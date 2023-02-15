import { StateDefinition } from '@/definitions';
import { LimitQuery, LimitQueryOptions } from '../limit';
import { OffsetQuery, OffsetQueryOptions } from '../offset';
import { SortQuery, SortQueryOptions } from '../sort';
import { ChildQueryOptions } from '../type';
import { WhereQuery, WhereQueryOptions } from '../where';
import { QueryProjection, SelectQuery, SelectQueryOptions } from '../select';
import { PopulateQuery, PopulateQueryOptions } from './populate';
import { ExpandQuery, ExpandQueryOptions } from './expand';

export interface SelectManyQuery<
  S extends StateDefinition,
  P extends QueryProjection<S>,
  R,
> extends SelectQuery<'SelectMany', S, S, R>,
    ExpandQuery<'SelectMany', S, S, P, R>,
    PopulateQuery<'SelectMany', S, S, P, R>,
    WhereQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery {}

export interface SelectManyQueryOptions<S extends StateDefinition>
  extends ChildQueryOptions<'SelectMany', S>,
    SelectQueryOptions<S>,
    ExpandQueryOptions<S>,
    PopulateQueryOptions<S>,
    WhereQueryOptions<S>,
    SortQueryOptions<S>,
    LimitQueryOptions,
    OffsetQueryOptions {}
