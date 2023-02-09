import { StateDefinition } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  ExpandQuery,
  ExpandQueryOptions,
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
    UniqueQuery<'FindUniqueWhere', S, S, P, R> {}

export interface FindUniqueWhereQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindUniqueWhere', S, S, R>,
    ExpandQuery<'FindUniqueWhere', S, S, P, R>,
    PopulateQuery<'FindUniqueWhere', S, S, P, R>,
    UniqueQuery<'FindUniqueWhere', S, S, P, R>,
    ExecQuery<QueryEntity<S, P, R> | null> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
