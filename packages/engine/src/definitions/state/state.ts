import { Defer, Deferred } from '../defer';
import { StateDefintionScalar } from './scalar';
import { SortDefinition, SortDefinitionKey } from './sort';
import { StateDefinitionWhere } from './where';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StateDefinition<N extends string = string, T = any> {
  $name: N;
  $id: SortDefinition<T>;
  $scalars: Defer<{ [K in keyof T]: StateDefintionScalar<T[K]> }>;
  $find: StateDefinitionWhere;
  $unique: { [K in keyof T]?: T[K] };
  $relations?: Defer<
    Record<
      string,
      readonly StateDefinition[] | readonly [readonly StateDefinition[]]
    >
  >;
  $states?: Defer<readonly StateDefinition[]>;
  $indexes?: Record<string, SortDefinition<T>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): T;
}

export type StateDefinitionType<S extends StateDefinition> =
  S extends StateDefinition<string, infer R> ? R : never;

export type StateDefinitionName<S extends StateDefinition = StateDefinition> =
  S['$name'];
// export type StateScalars<S extends State> = Deferred<S['$scalars']>;
export type StateDefinitionId<S extends StateDefinition> = Pick<
  StateDefinitionType<S>,
  SortDefinitionKey<S['$id'][number]>
>;
export type StateDefinitionFind<S extends StateDefinition> = S['$find'];
export type StateDefinitionUnique<S extends StateDefinition> = S['$unique'];
export type StateDefinitionIndexes<S extends StateDefinition> = NonNullable<
  S['$indexes']
>;
export type StateDefinitionRelations<S extends StateDefinition> = Deferred<
  S['$relations'],
  Record<never, never>
>;

// export type StateDefinitionStates<S extends State> = Deferred<S['$states']>;
