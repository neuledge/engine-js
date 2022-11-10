import { State } from '@/generated/index.js';
import { QueryType } from './query.js';

export interface RootQueryOptions<T extends QueryType, S extends State> {
  type: T;
  states: S[];
}

export interface ChildQueryOptions<T extends QueryType, S extends State> {
  type: T;
  states?: S[];
}
