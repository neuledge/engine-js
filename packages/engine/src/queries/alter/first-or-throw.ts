import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  FilterQuery,
  FilterQueryOptions,
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

export interface AlterFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ReturnQuery<'AlterFirstAndReturnOrThrow', I, O>,
    SelectQuery<'AlterFirstAndReturnOrThrow', I, O>,
    WhereQuery<I>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

// TODO enable populate support for alterFirstOrThrow query

export interface AlterFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterFirstAndReturnOrThrow', I, O, R>,
    // PopulateQuery<'AlterFirstAndReturnOrThrow', I, O, P, R>,
    WhereQuery<I>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R>> {}

export interface AlterFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    ReturnQueryOptions,
    SelectQueryOptions<O>,
    // PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    FilterQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterFirstOrThrow', I, O> {}
