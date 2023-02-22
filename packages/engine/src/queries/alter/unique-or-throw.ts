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
  UniqueQuery,
  UniqueQueryOptions,
} from '../raw';

export interface AlterUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ReturnQuery<'AlterUniqueAndReturnOrThrow', I, O>,
    SelectQuery<'AlterUniqueAndReturnOrThrow', I, O>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

// TODO enable populate support for alterUniqueOrThrow query

export interface AlterUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    // PopulateQuery<'AlterUniqueAndReturnOrThrow', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I> {}

export interface AlterUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends ReturnQuery<'AlterUniqueWhereAndReturnOrThrow', I, O>,
    SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    // PopulateQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R>> {}

export interface AlterUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    ReturnQueryOptions,
    SelectQueryOptions<O>,
    // PopulateQueryOptions<O>,
    UniqueQueryOptions<I>,
    FilterQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterUniqueOrThrow', I, O> {}
