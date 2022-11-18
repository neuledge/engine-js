import { StateDefinition } from '@/definitions/index.js';
import { QueryType } from './query.js';

export interface RootQueryOptions<
  T extends QueryType,
  S extends StateDefinition,
> {
  type: T;
  states: S[];
}

export interface ChildQueryOptions<
  T extends QueryType,
  S extends StateDefinition,
> {
  type: T;
  states?: S[];
}
