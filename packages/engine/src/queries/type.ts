import { State } from '@/index.js';
import { QueryType } from './query.js';

export interface TypeQueryOptions<T extends QueryType, S extends State> {
  type: T;
  states: S[];
}
