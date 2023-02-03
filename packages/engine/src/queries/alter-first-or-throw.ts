import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
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

export interface AlterFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O>,
    IncludeQuery<'AlterFirstAndReturnOrThrow', I, O>,
    RequireQuery<'AlterFirstAndReturnOrThrow', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterFirstAndReturnOrThrow', I, O, P, R>,
    RequireQuery<'AlterFirstAndReturnOrThrow', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R>> {}

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
