import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { RootQueryOptions } from './type';
import { SortQuery, SortQueryOptions } from './sort';
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

export interface FindFirstOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindFirstOrThrow', S, S, R>,
    IncludeQuery<'FindFirstOrThrow', S, S, P, R>,
    RequireQuery<'FindFirstOrThrow', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface FindFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirstOrThrow', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirstOrThrow', I, O> {}
