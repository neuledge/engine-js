import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelations } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { AbstractSelectQuery, Select } from '../select/index.js';
import { UniqueWhere, Where } from '../where.js';
import { StateRelationEntity, StateRelationState } from './state.js';

export class RelationQuery<
  S extends State,
  R,
  W extends Where<S> | UniqueWhere<S> | null | undefined,
  L extends number | null | undefined,
  O extends EntityListOffset | null | undefined,
> extends AbstractSelectQuery<S, W, L, O> {
  static clone<
    S extends State,
    R,
    W extends Where<S> | UniqueWhere<S> | null | undefined,
    L extends number | null | undefined,
    O extends EntityListOffset | null | undefined,
  >(
    instance: RelationQuery<S, unknown, W, L, O>,
  ): RelationQuery<S, R, W, L, O> {
    return new this<S, R, W, L, O>(
      instance._states,
      instance._where,
      instance._limit,
      instance._offset,
    );
  }

  select<P extends Select<S>>(
    select: P,
  ): RelationQuery<S, ProjectedEntity<S, P>, W, L, O> {
    const res = RelationQuery.clone<S, ProjectedEntity<S, P>, W, L, O>(this);

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): RelationQuery<
    S,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
    W,
    L,
    O
  >;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelationState<S, K>,
  >(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): RelationQuery<S, StateRelationEntity<S, K, R, Entity<SR>>, W, L, O>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelationState<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): RelationQuery<S, StateRelationEntity<S, K, R, RR>, W, L, O>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelationState<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelationState<S, K>>,
        ) => RelationQuery<StateRelationState<S, K>>)
      | null,
  ): RelationQuery<
    S,
    StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
    W,
    L,
    O
  > {
    if (!states) {
      states = RelationQuery.relationStates(this, key);
    }

    let rel = new RelationQuery(states, undefined, undefined, undefined);
    if (relation) rel = relation(rel);

    const res = RelationQuery.clone<
      S,
      StateRelationEntity<S, K, R, Entity<StateRelationState<S, K>>>,
      W,
      L,
      O
    >(this);
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }
}
