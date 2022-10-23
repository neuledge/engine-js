import { Entity, ProjectedEntity } from '@/entity.js';
import {
  State,
  StateMethodArguments,
  StateMethods,
} from '@/generated/index.js';
import { Select, SelectLogic } from '../select/index.js';
import { UniqueWhere, Where } from '../where.js';
import { MutateSelectQuery } from './select.js';

export class MutateQuery<
  S extends State,
  M extends StateMethods<S>,
  A extends StateMethodArguments<S, M>,
  F extends SelectLogic,
  W extends Where<S> | UniqueWhere<S> | null | undefined,
  L extends number | null | undefined,
> {
  protected _where: W;
  protected _limit: L;

  protected constructor(
    protected readonly states: S[],
    protected readonly method: M,
    protected readonly args: A[],
    protected readonly logic: F,
  ) {
    this.args = args;
  }

  select(select?: undefined): MutateSelectQuery<S, M, A, F, W, L>;
  select<P extends Select<S>>(
    select: P,
  ): MutateSelectQuery<S, M, A, F, W, L, ProjectedEntity<S, P>>;
  select<P extends Select<S>>(
    select?: P,
  ): MutateSelectQuery<S, M, A, F, W, L, Entity<S> | ProjectedEntity<S, P>> {
    const res = new MutateSelectQuery(
      this.states,
      this.method,
      this.args,
      this.logic,
      this._where,
      this._limit,
    );

    return select ? res.select(select) : res;
  }

  where(where: W): this {
    this._where = where;
    return this;
  }

  limit(limit: L): this {
    this._limit = limit;
    return this;
  }

  async exec(): Promise<void> {
    // TODO implement mutate.exec()
  }

  // eslint-disable-next-line unicorn/no-thenable
  then<TResult1 = void, TResult2 = never>(
    onfulfilled?:
      | ((value: void) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }
}
