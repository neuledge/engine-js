import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { RootQueryOptions } from './type';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';

export interface FindUniqueQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUnique', S, S, R>,
    IncludeQuery<'FindUnique', S, S, P, R>,
    RequireQuery<'FindUnique', S, S, P, R>,
    UniqueQuery<'FindUniqueWhere', S, S, P, R>,
    MatchQuery<S> {}

export interface FindUniqueWhereQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueWhere', S, S, R>,
    IncludeQuery<'FindUniqueWhere', S, S, P, R>,
    RequireQuery<'FindUniqueWhere', S, S, P, R>,
    UniqueQuery<'FindUniqueWhere', S, S, P, R>,
    MatchQuery<S>,
    ExecQuery<QueryEntity<S, P, R> | null> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    UniqueQueryOptions<O>,
    MatchQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
