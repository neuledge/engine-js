import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelations } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { UniqueWhere, Where } from '@/queries/where.js';
import {
  AbstractSelectQuery,
  Select,
  SelectRelationEntity,
  SelectRelationState,
} from './index.js.js.js';

export class SelectQuery<
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
  >(instance: SelectQuery<S, unknown, W, L, O>): SelectQuery<S, R, W, L, O> {
    return new this<S, R, W, L, O>(
      instance._states,
      instance._where,
      instance._limit,
      instance._offset,
    );
  }

  select<P extends Select<S>>(
    select: P,
  ): SelectQuery<S, ProjectedEntity<S, P>, W, L, O> {
    const res = SelectQuery.clone<S, ProjectedEntity<S, P>, W, L, O>(this);

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): SelectQuery<
    S,
    SelectRelationEntity<S, K, R, Entity<SelectRelationState<S, K>>>,
    W,
    L,
    O
  >;
  include<
    K extends keyof StateRelations<S>,
    SR extends SelectRelationState<S, K>,
  >(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): SelectQuery<S, SelectRelationEntity<S, K, R, Entity<SR>>, W, L, O>;
  include<
    K extends keyof StateRelations<S>,
    SR extends SelectRelationState<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: SelectQuery<SR>) => SelectQuery<SR, RR>,
  ): SelectQuery<S, SelectRelationEntity<S, K, R, RR>, W, L, O>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: SelectRelationState<S, K>[] | null,
    relation?:
      | ((
          rel: SelectQuery<SelectRelationState<S, K>>,
        ) => SelectQuery<SelectRelationState<S, K>>)
      | null,
  ): SelectQuery<
    S,
    SelectRelationEntity<S, K, R, Entity<SelectRelationState<S, K>>>,
    W,
    L,
    O
  > {
    if (!states) {
      states = SelectQuery.relationStates(this, key);
    }

    let rel = new SelectQuery(states, undefined, undefined, undefined);
    if (relation) rel = relation(rel);

    const res = SelectQuery.clone<
      S,
      SelectRelationEntity<S, K, R, Entity<SelectRelationState<S, K>>>,
      W,
      L,
      O
    >(this);
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }
}
