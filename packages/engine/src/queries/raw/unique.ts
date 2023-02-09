import { StateDefinition, StateName, StateUnique } from '@/definitions';
import { QueryMode } from '../query';
import { Query } from '../query';
import { QueryProjection } from './select';
import { AllKeys } from './utils';

// This query is very similar to the `WhereQuery`, if you make changes here, you
// probably want to make the same changes there.

export interface UniqueQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> {
  /**
   * Filter the returned entities by a unique where clause.
   * The where clause must match exactly one entity. Only uniquely identifiable
   * indexes can be used in the where clause.
   */
  unique(where: Unique<I>): Query<M, I, O, P, R>;
}

export interface UniqueQueryOptions<S extends StateDefinition> {
  unique: Unique<S> | true;
}

export type Unique<S extends StateDefinition> = StateUnique<S> & {
  [K in NonCommonUniqueKeys<S>]?: never;
};

// Forbidden all non-common keys between the given states.
// @see NonCommonWhereKeys on ""./where.ts" for more details.
type NonCommonUniqueKeys<S extends StateDefinition> = {
  [K in StateName<S>]: Exclude<
    AllKeys<StateUnique<S>>,
    S extends StateDefinition<K> ? AllKeys<StateUnique<S>> : never
  >;
}[StateName<S>];
