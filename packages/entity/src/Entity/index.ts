import { Projection, State } from '@neuledge/state';
import { EntityCreateData, EntityData, EntityUpdateData } from './data.js';

export type Entity<S extends State, P extends Projection<S>> = {
  [K in S['key']]: S extends State<K, infer R>
    ? P extends Projection<State<K, R>>
      ? EntityState<K> & EntityData<P, State<K, R>>
      : never
    : never;
}[S['key']];

export type EntityCreate<S extends State> = {
  [K in S['key']]: S extends State<K, infer R>
    ? EntityState<K> & EntityCreateData<State<K, R>>
    : never;
}[S['key']];

export type EntityUpdate<S extends State> = {
  [K in S['key']]: S extends State<K, infer R>
    ? EntityState<K> & EntityUpdateData<State<K, R>>
    : never;
}[S['key']];

export const isState =
  <
    K extends State['key'],
    T extends Entity<S, P>,
    P extends Projection<S>,
    S extends State,
  >(
    ...stateKeys: K[]
  ): ((doc: T) => doc is T & { $state: K }) =>
  (doc): doc is T & { $state: K } =>
    stateKeys.includes(doc.$state);

// helpers

interface EntityState<Key extends string> {
  $state: Key;
}
