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

export interface FindFirstOrThrowQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindFirstOrThrow', S, S, R>,
    ExpandQuery<'FindFirstOrThrow', S, S, P, R>,
    PopulateQuery<'FindFirstOrThrow', S, S, P, R>,
    WhereQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface FindFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirstOrThrow', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirstOrThrow', I, O> {}
