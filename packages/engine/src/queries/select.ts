import { StateDefinition, StateDefinitionType } from '@/definitions';
import { Merge } from './utils';

export type Select<S extends StateDefinition> = {
  [K in keyof Merge<StateDefinitionType<S>>]?: boolean;
};
