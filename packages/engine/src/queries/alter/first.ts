import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  MatchQuery,
  MatchQueryOptions,
  QueryEntity,
  QueryProjection,
  ReturnQuery,
  ReturnQueryOptions,
  RootQueryOptions,
  SelectQuery,
  SelectQueryOptions,
  SingleArgsQueryOptions,
  WhereQuery,
  WhereQueryOptions,
} from '../raw';

export interface AlterFirstQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ReturnQuery<'AlterFirstAndReturn', I, O>,
    SelectQuery<'AlterFirstAndReturn', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

// TODO enable populate support for alterFirst query

export interface AlterFirstAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterFirstAndReturn', I, O, R>,
    // PopulateQuery<'AlterFirstAndReturn', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R> | null> {}

export interface AlterFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirst', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    ReturnQueryOptions,
    SelectQueryOptions<O>,
    // PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterFirst', I, O> {}
