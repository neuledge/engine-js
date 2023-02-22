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

export interface FindUniqueOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    ExpandQuery<'FindUniqueOrThrow', S, S, P, R>,
    PopulateQuery<'FindUniqueOrThrow', S, S, P, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    FilterQuery<S> {}

export interface FindUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    FilterQuery<S>,
    ExpandQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    PopulateQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, P, R>,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface FindUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUniqueOrThrow', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    UniqueQueryOptions<I>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'FindUniqueOrThrow', I, O> {}
