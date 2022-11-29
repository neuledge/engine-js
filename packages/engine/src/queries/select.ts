import { StateDefinition, StateDefinitionType } from '@/definitions/index.js';
import { Merge } from './utils.js';

export type Select<S extends StateDefinition> = {
  [K in keyof Merge<StateDefinitionType<S>>]?: boolean;
};
