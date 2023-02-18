import { StateDefinition, StateRelations } from './state';

export interface StateDefinitionRelation {
  states: readonly StateDefinition[];
  list?: boolean | null;
  reference?: string;
}

export type StateAllRelations<S extends StateDefinition> =
  keyof StateRelations<S>;

export type StateManyRelations<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends {
    states: readonly StateDefinition[];
    list: true;
  }
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateOneRelations<S extends StateDefinition> = {
  [K in keyof StateRelations<S>]: StateRelations<S>[K] extends {
    states: readonly StateDefinition[];
    list?: false | null;
  }
    ? K
    : never;
}[keyof StateRelations<S>];

export type StateRelationStates<
  S extends StateDefinition,
  K extends StateAllRelations<S>,
> = StateRelations<S>[K] extends { states: readonly StateDefinition[] }
  ? StateRelations<S>[K]['states'][number]
  : never;
