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

export interface AlterUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterUniqueAndReturn', I, O, Entity<O>>,
    IncludeQuery<'AlterUniqueAndReturn', I, O, Entity<O>>,
    RequireQuery<'AlterUniqueAndReturn', I, O, Entity<O>>,
    UniqueQuery<'AlterUniqueWhere', I, O, Entity<O>>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueAndReturn', I, O, R>,
    IncludeQuery<'AlterUniqueAndReturn', I, O, R>,
    RequireQuery<'AlterUniqueAndReturn', I, O, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    MatchQuery<I> {}

export interface AlterUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    RequireQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    UniqueQuery<'AlterUniqueWhere', I, O, R>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    RequireQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    MatchQuery<I>,
    ExecQuery<R | null> {}

export interface AlterUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    UniqueQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterUnique', I, O> {}
