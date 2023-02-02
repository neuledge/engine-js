import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { LimitQuery, LimitQueryOptions } from './limit';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import { SelectQuery, SelectQueryOptions } from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface AlterManyQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterManyAndReturn', I, O, Entity<O>>,
    IncludeQuery<'AlterManyAndReturn', I, O, Entity<O>>,
    RequireQuery<'AlterManyAndReturn', I, O, Entity<O>>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

export interface AlterManyAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterManyAndReturn', I, O, R>,
    IncludeQuery<'AlterManyAndReturn', I, O, R>,
    RequireQuery<'AlterManyAndReturn', I, O, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<R[]> {}

export interface AlterManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterMany', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    LimitQueryOptions,
    ExecQueryOptions<'AlterMany', I, O> {}
