import { Entity, ProjectedEntity } from '@/entity.js';
import {
  State,
  StateMethodArguments,
  StateMethods,
  StateRelationState,
  StateRelations,
} from '@/generated/index.js';
import { createEntityList } from '@/list.js';
import { StateRelationEntity, RelationQuery } from '../relation/index.js';
import {
  AbstractSelectQuery,
  Select,
  SelectLogic,
  SelectLogicResponse,
} from '../select/index.js';
import { UniqueWhere, Where } from '../where.js';

export class MutateSelectQuery<
  S extends State,
  M extends StateMethods<S>,
  A extends StateMethodArguments<S, M>,
  F extends SelectLogic,
  W extends Where<S> | UniqueWhere<S> | null | undefined,
  L extends number | null | undefined,
  R = Entity<S>,
> extends AbstractSelectQuery<S> {
  protected static clone<
    S extends State,
    K extends StateMethods<S>,
    A extends StateMethodArguments<S, K>,
    F extends SelectLogic,
    W extends Where<S> | UniqueWhere<S> | undefined,
    L extends number | undefined,
    R,
  >(instance: MutateSelectQuery<S, K, A, F, W, L, unknown>) {
    const res = new this<S, K, A, F, W, L, R>(
      instance._states,
      instance.method,
      instance.args,
      instance.logic,
      instance.where,
      instance.limit,
    );

    return this.copySelect(instance, res);
  }

  constructor(
    states: S[],
    protected readonly method: M,
    protected readonly args: A[],
    protected readonly logic: F,
    protected readonly where: W,
    protected readonly limit: L,
  ) {
    super(states);
  }

  select<P extends Select<S>>(
    select?: P,
  ): MutateSelectQuery<S, M, A, F, W, L, ProjectedEntity<S, P>> {
    const res = MutateSelectQuery.clone<
      S,
      M,
      A,
      F,
      W,
      L,
      ProjectedEntity<S, P>
    >(this);

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): MutateSelectQuery<
    S,
    M,
    A,
    F,
    W,
    L,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>
  >;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelationState<S, K>,
  >(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): MutateSelectQuery<
    S,
    M,
    A,
    F,
    W,
    L,
    StateRelationEntity<S, K, R, Entity<SR>>
  >;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelationState<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): MutateSelectQuery<S, M, A, F, W, L, StateRelationEntity<S, K, R, RR>>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelationState<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelationState<S, K>>,
        ) => RelationQuery<StateRelationState<S, K>>)
      | null,
  ): MutateSelectQuery<
    S,
    M,
    A,
    F,
    W,
    L,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>
  > {
    if (!states) {
      states = AbstractSelectQuery.relationStates(this, key);
    }

    let rel = new RelationQuery<StateRelationState<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = MutateSelectQuery.clone<
      S,
      M,
      A,
      F,
      W,
      L,
      StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>
    >(this);
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  async exec(): Promise<SelectLogicResponse<R, F>> {
    // TODO implement mutate.select().exec()
    const items = createEntityList([], null);

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
