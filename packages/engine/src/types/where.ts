import { State, StateKey, StateQuery, StateUniqueQuery } from './state.js';
import { AllKeys } from './utils.js';

export type Where<S extends State> = StateQuery<S> & {
  [K in ForbiddenQueryKeys<S>]?: never;
};

export type UniqueWhere<S extends State> = StateUniqueQuery<S> & {
  [K in ForbiddenUniqueKeys<S>]?: never;
};

type ForbiddenUniqueKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateUniqueQuery<S>>,
    S extends State<object, K> ? AllKeys<StateUniqueQuery<S>> : never
  >;
}[StateKey<S>];

type ForbiddenQueryKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateQuery<S>>,
    S extends State<object, K> ? AllKeys<StateQuery<S>> : never
  >;
}[StateKey<S>];
