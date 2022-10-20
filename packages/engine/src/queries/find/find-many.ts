import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { EntityRelation, RelationQuery } from '../relation/index.js';
import { Select } from '../select.js';
import { FindQuery } from './find.js';

export class FindManyQuery<S extends State, R = Entity<S>> extends FindQuery<
  S,
  R
> {
  select<P extends Select<S>>(
    select: P,
  ): FindManyQuery<S, ProjectedEntity<S, P>> {
    const res = this.clone(
      new FindManyQuery<S, ProjectedEntity<S, P>>(this.states),
    );

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): FindManyQuery<S, EntityRelation<S, K, R, Entity<StateRelation<S, K>>>>;
  include<K extends keyof StateRelations<S>, SR extends StateRelation<S, K>>(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): FindManyQuery<S, EntityRelation<S, K, R, Entity<SR>>>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelation<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): FindManyQuery<S, EntityRelation<S, K, R, RR>>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelation<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelation<S, K>>,
        ) => RelationQuery<StateRelation<S, K>>)
      | null,
  ): FindManyQuery<S, EntityRelation<S, K, R, Entity<StateRelation<S, K>>>> {
    if (!states) {
      states = this.getRelationStates(key);
    }

    let rel = new RelationQuery<StateRelation<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = this.clone(
      new FindManyQuery<
        S,
        EntityRelation<S, K, R, Entity<StateRelation<S, K>>>
      >(this.states),
    );
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  exec = this.execMany;

  // eslint-disable-next-line unicorn/no-thenable
  then = this.execThen(this.exec);
}
