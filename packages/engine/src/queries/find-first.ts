import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { SortQuery, SortQueryOptions } from './sort';
import { RootQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface FindFirstQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindFirst', S, S, R>,
    IncludeQuery<'FindFirst', S, S, P, R>,
    RequireQuery<'FindFirst', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<QueryEntity<S, P, R> | null> {}

export interface FindFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirst', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirst', I, O> {}
