import { StateDefinition, StateRelations, StateType } from './state';

export type StateDefinitionMatchKeys<S extends StateDefinition> =
  keyof StateRelations<S>;

export type StateDefinitionIncludeManyKeys<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly [
    readonly StateDefinition[],
  ]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateDefinitionIncludeOneKeys<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly StateDefinition[]
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateDefinitionRequireOneKeys<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends readonly StateDefinition[]
    ? undefined extends StateType<S>[K]
      ? never
      : K
    : never;
}[keyof StateRelations<S>];

export type StateDefinitionRelationState<
  S extends StateDefinition,
  K extends keyof StateRelations<S>,
> = StateRelations<S>[K] extends readonly StateDefinition[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly StateDefinition[]]
  ? StateRelations<S>[K][0][number]
  : never;
