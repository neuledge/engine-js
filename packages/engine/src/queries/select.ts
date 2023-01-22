import { StateDefinition, StateType } from '@/definitions';
import { Merge } from './utils';

export type Select<S extends StateDefinition> = {
  [K in keyof Merge<StateType<S>>]?: boolean;
};
