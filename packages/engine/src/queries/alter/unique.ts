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

export interface AlterUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ReturnQuery<'AlterUniqueAndReturn', I, O>,
    SelectQuery<'AlterUniqueAndReturn', I, O>,
    UniqueQuery<'AlterUniqueWhere', I, O>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

// TODO enable populate support for alterUnique query

export interface AlterUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterUniqueAndReturn', I, O, R>,
    // PopulateQuery<'AlterUniqueAndReturn', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I> {}

export interface AlterUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends ReturnQuery<'AlterUniqueWhereAndReturn', I, O>,
    SelectQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    UniqueQuery<'AlterUniqueWhere', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    // PopulateQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    FilterQuery<I>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R> | null> {}

export interface AlterUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    ReturnQueryOptions,
    SelectQueryOptions<O>,
    // PopulateQueryOptions<O>,
    UniqueQueryOptions<I>,
    FilterQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterUnique', I, O> {}
