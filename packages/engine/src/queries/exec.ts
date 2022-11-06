import { State } from '@/generated/index.js';
import { QueryOptions, QueryType } from './query.js';

export interface ExecQuery<T> {
  exec(): Promise<T>;
  then: Promise<T>['then'];
}

export interface ExecQueryOptions<
  T extends QueryType,
  I extends State,
  O extends State,
  R = any, // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  exec(options: QueryOptions<T, I, O>): Promise<R>;
}
