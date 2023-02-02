import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { MatchQuery, MatchQueryOptions } from './match';
import { SelectQuery, SelectQueryOptions } from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface AlterUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterUniqueAndReturnOrThrow', I, O, Entity<O>>,
    IncludeQuery<'AlterUniqueAndReturnOrThrow', I, O, Entity<O>>,
    RequireQuery<'AlterUniqueAndReturnOrThrow', I, O, Entity<O>>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, Entity<O>>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    RequireQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    MatchQuery<I> {}

export interface AlterUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    RequireQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, R>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    RequireQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    MatchQuery<I>,
    ExecQuery<R> {}

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
