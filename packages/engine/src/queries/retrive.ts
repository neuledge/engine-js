import { ProjectedEntity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { Query, QueryMode } from './query';
import { Subset } from './utils';
import { Select } from './select';

// TODO retrive query: support 'includeMany', 'includeOne' and 'requireOne'

export interface RetriveQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> {
  select(): Query<M, I, O, R>;
  select<P extends Select<O>>(
    select: Subset<P, Select<O>>,
  ): Query<M, I, O, ProjectedEntity<O, P>>;

  //   includeMany<K extends StateDefinitionIncludeManyKeys<O>>(
  //     key: K,
  //   ): Query<
  //     M,
  //     I,
  //     O,
  //     R & { [k in K]: EntityList<Entity<StateDefinitionRelationState<O, K>>> }
  //   >;
  //   includeMany<
  //     K extends StateDefinitionIncludeManyKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //   >(
  //     key: K,
  //     states: RS[],
  //   ): Query<M, I, O, R & { [k in K]: EntityList<Entity<RS>> }>;
  //   includeMany<K extends StateDefinitionIncludeManyKeys<O>, RR>(
  //     key: K,
  //     states: null,
  //     query: (
  //       query: SelectManyQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectManyQuery<StateDefinitionRelationState<O, K>, RR>,
  //   ): Query<M, I, O, R & { [k in K]: EntityList<RR> }>;
  //   includeMany<
  //     K extends StateDefinitionIncludeManyKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //     RR,
  //   >(
  //     key: K,
  //     states: RS[],
  //     query: (query: SelectManyQuery<RS>) => SelectManyQuery<RS, RR>,
  //   ): Query<M, I, O, R & { [k in K]: EntityList<RR> }>;
  //
  //   includeOne<K extends StateDefinitionIncludeOneKeys<O>>(
  //     key: K,
  //   ): Query<
  //     M,
  //     I,
  //     O,
  //     R & { [k in K]?: Entity<StateDefinitionRelationState<O, K>> | null }
  //   >;
  //   includeOne<
  //     K extends StateDefinitionIncludeOneKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //   >(
  //     key: K,
  //     states: RS[],
  //   ): Query<M, I, O, R & { [k in K]?: Entity<RS> | null }>;
  //   includeOne<K extends StateDefinitionIncludeOneKeys<O>, RR>(
  //     key: K,
  //     states: null,
  //     query: (
  //       rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectOneQuery<StateDefinitionRelationState<O, K>, RR>,
  //   ): Query<M, I, O, R & { [k in K]?: RR | null }>;
  //   includeOne<
  //     K extends StateDefinitionIncludeOneKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //     RR,
  //   >(
  //     key: K,
  //     states: RS[],
  //     query: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  //   ): Query<M, I, O, R & { [k in K]?: RR | null }>;
  //
  //   requireOne<K extends StateDefinitionRequireOneKeys<O>>(
  //     key: K,
  //   ): Query<
  //     M,
  //     I,
  //     O,
  //     R & { [k in K]: Entity<StateDefinitionRelationState<O, K>> }
  //   >;
  //   requireOne<
  //     K extends StateDefinitionRequireOneKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //   >(
  //     key: K,
  //     states: RS[],
  //   ): Query<M, I, O, R & { [k in K]: Entity<RS> }>;
  //   requireOne<K extends StateDefinitionRequireOneKeys<O>, RR>(
  //     key: K,
  //     states: null,
  //     query: (
  //       rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectOneQuery<StateDefinitionRelationState<O, K>, RR>,
  //   ): Query<M, I, O, R & { [k in K]: RR }>;
  //   requireOne<
  //     K extends StateDefinitionRequireOneKeys<O>,
  //     RS extends StateDefinitionRelationState<O, K>,
  //     RR,
  //   >(
  //     key: K,
  //     states: RS[],
  //     query: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  //   ): Query<M, I, O, R & { [k in K]: RR }>;
}

export interface RetriveQueryOptions<S extends StateDefinition> {
  select?: Select<S> | true;

  // includeMany?: {
  //   [K in StateDefinitionIncludeManyKeys<S>]?: SelectManyQueryOptions<
  //     StateDefinitionRelationState<S, K>,
  //     StateDefinitionRelationState<S, K>
  //   >;
  // };
  // includeOne?: {
  //   [K in StateDefinitionIncludeOneKeys<S>]?: SelectOneQueryOptions<
  //     StateDefinitionRelationState<S, K>,
  //     StateDefinitionRelationState<S, K>
  //   >;
  // };
  // requireOne?: {
  //   [K in StateDefinitionRequireOneKeys<S>]?: SelectOneQueryOptions<
  //     StateDefinitionRelationState<S, K>,
  //     StateDefinitionRelationState<S, K>
  //   >;
  // };
}
