import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';

export interface FindUniqueOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    IncludeQuery<'FindUniqueOrThrow', S, S, P, R>,
    RequireQuery<'FindUniqueOrThrow', S, S, P, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    MatchQuery<S> {}

export interface FindUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    IncludeQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    RequireQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    MatchQuery<S>,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface FindUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUniqueOrThrow', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    UniqueQueryOptions<O>,
    MatchQueryOptions<O>,
    ExecQueryOptions<'FindUniqueOrThrow', I, O> {}
