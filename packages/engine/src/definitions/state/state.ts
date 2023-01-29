import { Defer, Deferred } from '../defer';
import {
  StateDefinitionId as StateDefinitionId,
  StateDefinitionIndex,
} from './indexes';
import { StateDefintionScalar } from './scalar';
import { SortDefinitionKey } from './sort';
import { StateDefinitionUnique, StateDefinitionWhere } from './where';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StateDefinition<N extends string = string, T = any> {
  $name: N;
  $id: StateDefinitionId<T>;
  $scalars: Defer<{ [K in keyof T]: StateDefintionScalar<T[K]> }>;
  $find: StateDefinitionWhere;
  $unique: StateDefinitionUnique<T>;
  $relations?: Defer<
    Record<
      string,
      readonly StateDefinition[] | readonly [readonly StateDefinition[]]
    >
  >;
  $transforms?: Defer<readonly StateDefinition[]>;
  $indexes?: Record<string, StateDefinitionIndex<T>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type StateType<S extends StateDefinition> = S extends StateDefinition<
  string,
  infer R
>
  ? R
  : never;

export type StateName<S extends StateDefinition = StateDefinition> = S['$name'];
// export type StateScalars<S extends State> = Deferred<S['$scalars']>;
export type StateId<S extends StateDefinition> = Pick<
  StateType<S>,
  SortDefinitionKey<S['$id']['fields'][number]>
>;
export type StateFind<S extends StateDefinition> = S['$find'];
export type StateUnique<S extends StateDefinition> = S['$unique'];
export type StateIndexes<S extends StateDefinition> = NonNullable<
  S['$indexes']
>;
export type StateRelations<S extends StateDefinition> = Deferred<
  S['$relations'],
  Record<never, never>
>;

// export type StateDefinitionStates<S extends State> = Deferred<S['$transforms']>;
