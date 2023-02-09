import { StateDefinition } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  ExpandQuery,
  ExpandQueryOptions,
  OffsetQuery,
  OffsetQueryOptions,
  PopulateQuery,
  PopulateQueryOptions,
  QueryEntity,
  QueryProjection,
  RootQueryOptions,
  SelectQuery,
  SelectQueryOptions,
  SortQuery,
  SortQueryOptions,
  WhereQuery,
  WhereQueryOptions,
} from '../raw';

export interface FindFirstQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindFirst', S, S, R>,
    ExpandQuery<'FindFirst', S, S, P, R>,
    PopulateQuery<'FindFirst', S, S, P, R>,
    WhereQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<QueryEntity<S, P, R> | null> {}

export interface FindFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirst', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirst', I, O> {}
