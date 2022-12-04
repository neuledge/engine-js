import { StateDefinition } from '@/definitions';
import { QueryType } from './query';

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
