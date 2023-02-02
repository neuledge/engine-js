import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import { SelectQuery, SelectQueryOptions } from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface AlterFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O, Entity<O>>,
    IncludeQuery<'AlterFirstAndReturnOrThrow', I, O, Entity<O>>,
    RequireQuery<'AlterFirstAndReturnOrThrow', I, O, Entity<O>>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    RequireQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<R> {}

export interface AlterFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterFirstOrThrow', I, O> {}
