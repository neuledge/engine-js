import { StateDefinition } from '@/definitions';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { SortQuery, SortQueryOptions } from './sort';
import { ChildQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import { QueryProjection, SelectQuery, SelectQueryOptions } from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface SelectManyQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'SelectMany', S, S, R>,
    IncludeQuery<'SelectMany', S, S, P, R>,
    RequireQuery<'SelectMany', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery {}

export interface SelectManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectMany', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions {}
