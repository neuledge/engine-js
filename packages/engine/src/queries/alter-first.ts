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

export interface AlterFirstQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'AlterFirstAndReturn', I, O>,
    IncludeQuery<'AlterFirstAndReturn', I, O>,
    RequireQuery<'AlterFirstAndReturn', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterFirstAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterFirstAndReturn', I, O, R>,
    IncludeQuery<'AlterFirstAndReturn', I, O, P, R>,
    RequireQuery<'AlterFirstAndReturn', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R> | null> {}

export interface AlterFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirst', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterFirst', I, O> {}
