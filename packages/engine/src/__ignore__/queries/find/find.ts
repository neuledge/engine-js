import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelationState, StateRelations } from '@/generated/index.js';
import { createEntityList, EntityListOffset } from '@/list.js';
import { UniqueWhere, Where } from '@/queries/queries_old/where.js'; 
import { StateRelationEntity } from '../relation/index.js';
import { RelationQuery } from '../relation/relation.js';
import {
  AbstractSelectQuery,
  Select,
  SelectLogic,
  SelectLogicResponse,
} from '../select/index.js';

const EXEC_MAX_DEFAULT_LIMIT = 101;

export class FindQuery<
  S extends State,
  F extends SelectLogic,
  R,
  W extends Where<S> | UniqueWhere<S> | null | undefined,
  L extends number | null | undefined,
  O extends EntityListOffset | null | undefined,
> extends AbstractSelectQuery<S, W, L, O> {
  static clone<
    S extends State,
    F extends SelectLogic,
    R,
    W extends Where<S> | UniqueWhere<S>,
    L extends number,
    O extends EntityListOffset,
  >(instance: FindQuery<S, F, unknown, W, L, O>): FindQuery<S, F, R, W, L, O> {
    const res = new this<S, F, R, W, L, O>(instance._states, instance.logic);

    res._where = instance._where;
    res._limit = instance._limit;
    res._offset = instance._offset;

    return super.copySelect(instance, res);
  }

  protected constructor(
    states: S[],
    private readonly logic: F,
    _limit: L,
    _offset: O,
    _select?: Select<S>,
    _relations?: 
  ) {
    super(states);
  }

  where(where: W | null | undefined): this {
    this._where = where ?? undefined;
    return this;
  }

  select<P extends Select<S>>(
    select: P,
  ): FindQuery<S, F, ProjectedEntity<S, P>, W, L, O> {
    const res = FindQuery.clone<S, F, ProjectedEntity<S, P>, W, L, O>(this);

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): FindQuery<
    S,
    F,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
    W,
    L,
    O
  >;
  include<K extends keyof StateRelations<S>, SR extends StateRelationState<S, K>>(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): FindQuery<S, F, StateRelationEntity<S, K, R, Entity<SR>>, W, L, O>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelationState<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): FindQuery<S, F, StateRelationEntity<S, K, R, RR>, W, L, O>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelationState<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelationState<S, K>>,
        ) => RelationQuery<StateRelationState<S, K>>)
      | null,
  ): FindQuery<
    S,
    F,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
    W,
    L,
    O
  > {
    if (!states) {
      states = FindQuery.relationStates(this, key);
    }

    let rel = new RelationQuery<StateRelationState<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = FindQuery.clone<
      S,
      F,
      StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
      W,
      L,
      O
    >(this);
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  async exec(): Promise<SelectLogicResponse<R, F>> {
    const limit = this._limit ?? EXEC_MAX_DEFAULT_LIMIT;

    // TODO implement find.execMany()
    const items = createEntityList([], null);

    if (this._limit == null && items.length >= limit) {
      throw new RangeError(
        `Too many entities requested without a limit for ${this.stateNames}`,
      );
    }

    return this.logic<R>(items) as Promise<SelectLogicResponse<R, F>>;
  }

  // eslint-disable-next-line unicorn/no-thenable
  then<TResult1 = SelectLogicResponse<R, F>, TResult2 = never>(
    onfulfilled?:
      | ((value: SelectLogicResponse<R, F>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }
}
