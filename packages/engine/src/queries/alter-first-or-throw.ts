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
import { AlterReturnQuery, AlterReturnQueryOptions } from './return';

export interface AlterFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends AlterReturnQuery<'AlterFirstAndReturnOrThrow', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    IncludeQuery<'AlterFirstAndReturnOrThrow', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R>> {}

export interface AlterFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    AlterReturnQueryOptions,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterFirstOrThrow', I, O> {}
