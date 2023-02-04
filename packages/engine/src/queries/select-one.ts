import { StateDefinition } from '@/definitions';
import { ChildQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import { QueryProjection, SelectQuery, SelectQueryOptions } from './select';

export interface SelectOneQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'SelectOne', S, S, R>,
    IncludeQuery<'SelectOne', S, S, P, R>,
    RequireQuery<'SelectOne', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S> {}

export interface SelectOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectOne', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I> {}
