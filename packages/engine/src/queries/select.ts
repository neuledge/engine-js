import { StateDefinition, StateType } from '@/definitions';
import { ProjectedEntity } from '@/entity';
import { Query, QueryMode } from './query';
import { Merge, Subset } from './utils';

export interface SelectQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> {
  /**
   * Select and return all properties of the entity.
   * The return type will be the entity itself.
   */
  select(): Query<M, I, O, R>;

  /**
   * Select and return a subset of the entity's properties.
   * The return type will be a projected entity.
   */
  select<P extends Select<O>>(
    select: Subset<P, Select<O>>,
  ): Query<M, I, O, ProjectedEntity<O, P>>;
}

export interface SelectQueryOptions<
  S extends StateDefinition,
  P extends Select<S> = Select<S>,
> {
  select?: P | true | null;
}

export type Select<S extends StateDefinition> = {
  [K in keyof Merge<StateType<S>>]?: boolean;
};
