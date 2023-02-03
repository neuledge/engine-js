import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { SortQuery, SortQueryOptions } from './sort';
import { RootQueryOptions } from './type';
import { MatchQuery, MatchQueryOptions } from './match';
import { WhereQuery, WhereQueryOptions } from './where';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface FindManyQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindMany', S, S, R>,
    IncludeQuery<'FindMany', S, S, P, R>,
    RequireQuery<'FindMany', S, S, P, R>,
    WhereQuery<S>,
    MatchQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<QueryEntity<S, P, R>>> {}

export interface FindManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindMany', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions,
    ExecQueryOptions<'FindMany', I, O> {}
