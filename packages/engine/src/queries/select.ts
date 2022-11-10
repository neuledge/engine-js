import { Entity, ProjectedEntity } from '@/entity.js';
import {
  State,
  StateIncludeManyKeys,
  StateIncludeOneKeys,
  StateRelationState,
  StateRequireOneKeys,
  StateType,
} from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { Query, QueryMode } from './query.js';
import { SelectManyQuery, SelectManyQueryOptions } from './select-many.js';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one.js';
import { Merge, Subset } from './utils.js';

export interface SelectQuery<
  M extends QueryMode,
  I extends State,
  O extends State,
  R,
> {
  select(): Query<M, I, O, R>;
  select<P extends Select<O>>(
    select: Subset<P, Select<O>>,
  ): Query<M, I, O, ProjectedEntity<O, P>>;

  includeMany<K extends StateIncludeManyKeys<O>>(
    key: K,
  ): Query<
    M,
    I,
    O,
    R & { [k in K]: EntityList<Entity<StateRelationState<O, K>>> }
  >;
  includeMany<
    K extends StateIncludeManyKeys<O>,
    RS extends StateRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, R & { [k in K]: EntityList<Entity<RS>> }>;
  includeMany<K extends StateIncludeManyKeys<O>, RR>(
    key: K,
    states: null,
    query: (
      query: SelectManyQuery<StateRelationState<O, K>>,
    ) => SelectManyQuery<StateRelationState<O, K>, RR>,
  ): Query<M, I, O, R & { [k in K]: EntityList<RR> }>;
  includeMany<
    K extends StateIncludeManyKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states: RS[],
    query: (query: SelectManyQuery<RS>) => SelectManyQuery<RS, RR>,
  ): Query<M, I, O, R & { [k in K]: EntityList<RR> }>;

  includeOne<K extends StateIncludeOneKeys<O>>(
    key: K,
  ): Query<M, I, O, R & { [k in K]?: Entity<StateRelationState<O, K>> | null }>;
  includeOne<
    K extends StateIncludeOneKeys<O>,
    RS extends StateRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, R & { [k in K]?: Entity<RS> | null }>;
  includeOne<K extends StateIncludeOneKeys<O>, RR>(
    key: K,
    states: null,
    query: (
      rel: SelectOneQuery<StateRelationState<O, K>>,
    ) => SelectOneQuery<StateRelationState<O, K>, RR>,
  ): Query<M, I, O, R & { [k in K]?: RR | null }>;
  includeOne<
    K extends StateIncludeOneKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states: RS[],
    query: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  ): Query<M, I, O, R & { [k in K]?: RR | null }>;

  requireOne<K extends StateRequireOneKeys<O>>(
    key: K,
  ): Query<M, I, O, R & { [k in K]: Entity<StateRelationState<O, K>> }>;
  requireOne<
    K extends StateRequireOneKeys<O>,
    RS extends StateRelationState<O, K>,
  >(
    key: K,
    states: RS[],
  ): Query<M, I, O, R & { [k in K]: Entity<RS> }>;
  requireOne<K extends StateRequireOneKeys<O>, RR>(
    key: K,
    states: null,
    query: (
      rel: SelectOneQuery<StateRelationState<O, K>>,
    ) => SelectOneQuery<StateRelationState<O, K>, RR>,
  ): Query<M, I, O, R & { [k in K]: RR }>;
  requireOne<
    K extends StateRequireOneKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states: RS[],
    query: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  ): Query<M, I, O, R & { [k in K]: RR }>;
}

export interface SelectQueryOptions<S extends State> {
  select?: Select<S>;
  includeMany?: {
    [K in StateIncludeManyKeys<S>]?: SelectManyQueryOptions<
      StateRelationState<S, K>,
      StateRelationState<S, K>
    >;
  };
  includeOne?: {
    [K in StateIncludeOneKeys<S>]?: SelectOneQueryOptions<
      StateRelationState<S, K>,
      StateRelationState<S, K>
    >;
  };
  requireOne?: {
    [K in StateRequireOneKeys<S>]?: SelectOneQueryOptions<
      StateRelationState<S, K>,
      StateRelationState<S, K>
    >;
  };
}

export type Select<S extends State> = {
  [K in keyof Merge<StateType<S>>]?: boolean;
};
