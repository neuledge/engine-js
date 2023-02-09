import { StateDefinition, StateRelations } from './state';

export type StateAllRelations<S extends StateDefinition> =
  keyof StateRelations<S>;

export type StateManyRelations<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly [
    readonly StateDefinition[],
  ]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateOneRelations<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly StateDefinition[]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateRelationStates<
  S extends StateDefinition,
  K extends StateAllRelations<S>,
> = StateRelations<S>[K] extends readonly StateDefinition[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly StateDefinition[]]
  ? StateRelations<S>[K][0][number]
  : never;
