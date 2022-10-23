import { State, StateRelations } from './state.js';

export type StateFilterKeys<S extends State> = keyof StateRelations<S>;

export type StateIncludeManyKeys<S extends State> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly [
    readonly State[],
  ]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateIncludeOneKeys<S extends State> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly State[]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateRequireOneKeys<S extends State> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly State[]
    ? undefined extends InstanceType<S>[K]
      ? never
      : K
    : never;
}[keyof StateRelations<S>];

export type StateRelationState<
  S extends State,
  K extends keyof StateRelations<S>,
> = StateRelations<S>[K] extends readonly State[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly State[]]
  ? StateRelations<S>[K][0][number]
  : never;