import { StateDefinition } from '@/definitions';
import { QueryOptions, QueryType } from './query';

export interface ExecQuery<T> {
  /**
   * Execute query and return result as promise.
   */
  exec(): Promise<T>;

  /**
   *  A shorthand for `exec()`, making the query thenable by appling `await` or
   * `.then()` directly to the query without calling `exec()` first.
   */
  then: Promise<T>['then'];
}

export interface ExecQueryOptions<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
  R = any, // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  exec(options: QueryOptions<T, I, O>): Promise<R>;
}
