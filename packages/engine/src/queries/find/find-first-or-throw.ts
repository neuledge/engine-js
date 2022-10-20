import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { EntityRelation, RelationQuery } from '../relation/index.js';
import { Select } from '../select.js';
import { FindQuery } from './find.js';

export class FindFirstOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends FindQuery<S, R> {
  select<P extends Select<S>>(
    select: P,
  ): FindFirstOrThrowQuery<S, ProjectedEntity<S, P>> {
    const res = this.clone(
      new FindFirstOrThrowQuery<S, ProjectedEntity<S, P>>(this.states),
    );

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): FindFirstOrThrowQuery<
    S,
    EntityRelation<S, K, R, Entity<StateRelation<S, K>>>
  >;
  include<K extends keyof StateRelations<S>, SR extends StateRelation<S, K>>(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): FindFirstOrThrowQuery<S, EntityRelation<S, K, R, Entity<SR>>>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelation<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): FindFirstOrThrowQuery<S, EntityRelation<S, K, R, RR>>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelation<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelation<S, K>>,
        ) => RelationQuery<StateRelation<S, K>>)
      | null,
  ): FindFirstOrThrowQuery<
    S,
    EntityRelation<S, K, R, Entity<StateRelation<S, K>>>
  > {
    if (!states) {
      states = this.getRelationStates(key);
    }

    let rel = new RelationQuery<StateRelation<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = this.clone(
      new FindFirstOrThrowQuery<
        S,
        EntityRelation<S, K, R, Entity<StateRelation<S, K>>>
      >(this.states),
    );
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit(limit: 1): this {
    return this;
  }

  exec = this.execFirstOrThrow;
}
