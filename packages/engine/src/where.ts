import { State, StateKey, StateQuery, StateUnique } from './index.js';
import { AllKeys } from './utils.js';

export type Where<S extends State> = StateQuery<S> & {
  [K in ForbiddenQueryKeys<S>]?: never;
};

export type UniqueWhere<S extends State> = StateUnique<S> & {
  [K in ForbiddenUniqueKeys<S>]?: never;
};

type ForbiddenUniqueKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateUnique<S>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    S extends State<any, K> ? AllKeys<StateUnique<S>> : never
  >;
}[StateKey<S>];

type ForbiddenQueryKeys<S extends State> = {
  [K in StateKey<S>]: Exclude<
    AllKeys<StateQuery<S>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    S extends State<any, K> ? AllKeys<StateQuery<S>> : never
  >;
}[StateKey<S>];
