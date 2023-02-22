import { StateDefinition } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  ExpandQuery,
  ExpandQueryOptions,
  FilterQuery,
  FilterQueryOptions,
  PopulateQuery,
  PopulateQueryOptions,
  QueryEntity,
  QueryProjection,
  RootQueryOptions,
  SelectQuery,
  SelectQueryOptions,
  UniqueQuery,
  UniqueQueryOptions,
} from '../raw';

export interface FindUniqueQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUnique', S, S, R>,
    ExpandQuery<'FindUnique', S, S, P, R>,
    PopulateQuery<'FindUnique', S, S, P, R>,
    UniqueQuery<'FindUniqueWhere', S, S, P, R>,
    FilterQuery<S> {}

export interface FindUniqueWhereQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueWhere', S, S, R>,
    ExpandQuery<'FindUniqueWhere', S, S, P, R>,
    PopulateQuery<'FindUniqueWhere', S, S, P, R>,
    UniqueQuery<'FindUniqueWhere', S, S, P, R>,
    FilterQuery<S>,
    ExecQuery<QueryEntity<S, P, R> | null> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    UniqueQueryOptions<I>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'FindUnique', I, O> {}
