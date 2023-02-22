import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import {
  ExecQuery,
  ExecQueryOptions,
  ExpandQuery,
  ExpandQueryOptions,
  FilterQuery,
  FilterQueryOptions,
  LimitQuery,
  LimitQueryOptions,
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

export interface FindManyQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'FindMany', S, S, R>,
    ExpandQuery<'FindMany', S, S, P, R>,
    PopulateQuery<'FindMany', S, S, P, R>,
    WhereQuery<S>,
    FilterQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<QueryEntity<S, P, R>>> {}

export interface FindManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindMany', I>,
    SelectQueryOptions<O>,
    ExpandQueryOptions<O>,
    PopulateQueryOptions<O>,
    WhereQueryOptions<I>,
    FilterQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions,
    ExecQueryOptions<'FindMany', I, O> {}
