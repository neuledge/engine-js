import {
  StateDefinition,
  StateDefinitionRelations,
  StateDefinitionType,
} from './state';

export type StateDefinitionMatchKeys<S extends StateDefinition> =
  keyof StateDefinitionRelations<S>;

export type StateDefinitionIncludeManyKeys<S extends StateDefinition> = {
  [K in keyof StateDefinitionRelations<S>]: StateDefinitionRelations<S>[K] extends readonly [
    readonly StateDefinition[],
  ]
    ? K
    : never;
}[keyof StateDefinitionRelations<S>];

export type StateDefinitionIncludeOneKeys<S extends StateDefinition> = {
  [K in keyof StateDefinitionRelations<S>]: StateDefinitionRelations<S>[K] extends readonly StateDefinition[]
    ? K
    : never;
}[keyof StateDefinitionRelations<S>];

export type StateDefinitionRequireOneKeys<S extends StateDefinition> = {
  [K in keyof StateDefinitionRelations<S>]: StateDefinitionRelations<S>[K] extends readonly StateDefinition[]
    ? undefined extends StateDefinitionType<S>[K]
      ? never
      : K
    : never;
}[keyof StateDefinitionRelations<S>];

export type StateDefinitionRelationState<
  S extends StateDefinition,
  K extends keyof StateDefinitionRelations<S>,
> = StateDefinitionRelations<S>[K] extends readonly StateDefinition[]
  ? StateDefinitionRelations<S>[K][number]
  : StateDefinitionRelations<S>[K] extends readonly [readonly StateDefinition[]]
  ? StateDefinitionRelations<S>[K][0][number]
  : never;
