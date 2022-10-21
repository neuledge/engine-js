import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { createEntityList, EntityList, EntityListOffset } from '@/list.js';
import { Select } from '@/queries/select.js';
import { UniqueWhere, Where } from '@/queries/where.js';
import { EntityRelation } from '../relation/index.js';
import { RelationQuery } from '../relation/relation.js';
import { FindLogic, FindLogicResponse } from './logic.js';

const EXEC_MAX_DEFAULT_LIMIT = 101;

export class FindQuery<
  S extends State,
  F extends FindLogic,
  R,
  W extends Where<S> | UniqueWhere<S>,
  L extends number,
  O extends EntityListOffset,
> extends RelationQuery<S, R, W, L, O> {
  protected _where: W | undefined;
  protected _select: Select<S> | undefined;
  protected _limit: number | undefined;
  protected _offset: EntityListOffset | undefined;

  protected constructor(states: S[], private readonly logic: F) {
    super(states);
  }

  async exec(): Promise<FindLogicResponse<R, F>> {
    const limit = this._limit ?? EXEC_MAX_DEFAULT_LIMIT;

    // TODO implement find.execMany()
    const items = createEntityList([], null);

    if (this._limit == null && items.length >= limit) {
      throw new RangeError(
        `Too many entities requested without a limit for ${this.stateNames}`,
      );
    }

    return this.logic<R>(items) as Promise<FindLogicResponse<R, F>>;
  }

  // eslint-disable-next-line unicorn/no-thenable
  then<TResult1 = FindLogicResponse<R, F>, TResult2 = never>(
    onfulfilled?:
      | ((value: FindLogicResponse<R, F>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }

  // overrides

  select<P extends Select<S>>(
    select: P,
  ): FindQuery<S, F, ProjectedEntity<S, P>, W, L, O> {
    const res = this.clone(
      new FindQuery<S, F, ProjectedEntity<S, P>, W, L, O>(
        this.states,
        this.logic,
      ),
    );

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
    EntityRelation<S, K, R, Entity<StateRelation<S, K>>>,
    W,
    L,
    O
  >;
  include<K extends keyof StateRelations<S>, SR extends StateRelation<S, K>>(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): FindQuery<S, F, EntityRelation<S, K, R, Entity<SR>>, W, L, O>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelation<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): FindQuery<S, F, EntityRelation<S, K, R, RR>, W, L, O>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelation<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelation<S, K>>,
        ) => RelationQuery<StateRelation<S, K>>)
      | null,
  ): FindQuery<
    S,
    F,
    EntityRelation<S, K, R, Entity<StateRelation<S, K>>>,
    W,
    L,
    O
  > {
    if (!states) {
      states = this.getRelationStates(key);
    }

    let rel = new RelationQuery<StateRelation<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = this.clone(
      new FindQuery<
        S,
        F,
        EntityRelation<S, K, R, Entity<StateRelation<S, K>>>,
        W,
        L,
        O
      >(this.states, this.logic),
    );
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  // logics

  many(res: EntityList<R>): EntityList<R> {
    return res;
  }

  first([res]: EntityList<R>): R {
    return res;
  }

  firstOrThrow([res]: EntityList<R>): R {
    if (res == null) {
      // TODO improve error type and message
      throw new ReferenceError(
        `Can't find ${JSON.stringify(this._where)} for ${this.stateNames}`,
      );
    }

    return res;
  }
}
