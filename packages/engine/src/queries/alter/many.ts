import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  LimitQuery,
  LimitQueryOptions,
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

export interface AlterManyQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ReturnQuery<'AlterManyAndReturn', I, O>,
    SelectQuery<'AlterManyAndReturn', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

// TODO enable populate support for alterMany query

export interface AlterManyAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> extends SelectQuery<'AlterManyAndReturn', I, O, R>,
    // PopulateQuery<'AlterManyAndReturn', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<QueryEntity<O, P, R>[]> {}

export interface AlterManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterMany', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    ReturnQueryOptions,
    SelectQueryOptions<O>,
    // PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    LimitQueryOptions,
    ExecQueryOptions<'AlterMany', I, O> {}
