import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import { SelectQuery, SelectQueryOptions } from './select';

export interface FindUniqueOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    IncludeQuery<'FindUniqueOrThrow', S, S, R>,
    RequireQuery<'FindUniqueOrThrow', S, S, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    MatchQuery<S> {}

export interface FindUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    IncludeQuery<'FindUniqueWhereOrThrow', S, S, R>,
    RequireQuery<'FindUniqueWhereOrThrow', S, S, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    MatchQuery<S>,
    ExecQuery<R> {}

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
