import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { MatchQuery, MatchQueryOptions } from './match';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface AlterUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterUniqueAndReturnOrThrow', I, O>,
    IncludeQuery<'AlterUniqueAndReturnOrThrow', I, O>,
    RequireQuery<'AlterUniqueAndReturnOrThrow', I, O>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueAndReturnOrThrow', I, O, P, R>,
    RequireQuery<'AlterUniqueAndReturnOrThrow', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    MatchQuery<I> {}

export interface AlterUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    RequireQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, P, R>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    RequireQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R>> {}

export interface AlterUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    UniqueQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterUniqueOrThrow', I, O> {}
