import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { Select } from '@/queries/select.js';
import { UniqueWhere, Where } from '@/queries/where.js';
import { EntityRelation } from './entity.js';

export class RelationQuery<
  S extends State,
  R = Entity<S>,
  W extends Where<S> | UniqueWhere<S> = Where<S>,
> {
  protected _where: W | undefined;
  protected _select: Select<S> | undefined;
  protected _relations: {
    [K in keyof StateRelations<S>]?: RelationQuery<StateRelation<S, K>>;
  } = {};
  protected _limit: number | undefined;
  protected _offset: EntityListOffset | undefined;

  constructor(public readonly states: S[]) {}

  protected clone<R, T extends RelationQuery<S, R, W>>(instance: T): T {
    instance._where = this._where;
    instance._select = this._select;
    instance._relations = this._relations;
    instance._limit = this._limit;
    instance._offset = this._offset;

    return instance;
  }

  where(where: W | null | undefined): this {
    this._where = where ?? undefined;
    return this;
  }

  select<P extends Select<S>>(
    select: P,
  ): RelationQuery<S, ProjectedEntity<S, P>, W> {
    const res = this.clone(
      new RelationQuery<S, ProjectedEntity<S, P>, W>(this.states),
    );

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: null,
    relation?: null,
  ): RelationQuery<S, EntityRelation<S, K, R, Entity<StateRelation<S, K>>>, W>;
  include<K extends keyof StateRelations<S>, SR extends StateRelation<S, K>>(
    key: K,
    states?: SR[] | null,
    relation?: null,
  ): RelationQuery<S, EntityRelation<S, K, R, Entity<SR>>, W>;
  include<
    K extends keyof StateRelations<S>,
    SR extends StateRelation<S, K>,
    RR,
  >(
    key: K,
    states: SR[],
    relation: (rel: RelationQuery<SR>) => RelationQuery<SR, RR>,
  ): RelationQuery<S, EntityRelation<S, K, R, RR>, W>;
  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: StateRelation<S, K>[] | null,
    relation?:
      | ((
          rel: RelationQuery<StateRelation<S, K>>,
        ) => RelationQuery<StateRelation<S, K>>)
      | null,
  ): RelationQuery<S, EntityRelation<S, K, R, Entity<StateRelation<S, K>>>, W> {
    if (!states) {
      states = this.getRelationStates(key);
    }

    let rel = new RelationQuery<StateRelation<S, K>>(states);
    if (relation) rel = relation(rel);

    const res = this.clone(
      new RelationQuery<
        S,
        EntityRelation<S, K, R, Entity<StateRelation<S, K>>>,
        W
      >(this.states),
    );
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  protected getRelationStates<K extends keyof StateRelations<S>>(
    key: K,
  ): StateRelation<S, K>[] {
    // eslint-disable-next-line unicorn/prefer-spread
    return ([] as State[]).concat(
      ...this.states.map((item): State[] => {
        const rel = item.$relations()[key as string];

        return Array.isArray(rel) && Array.isArray(rel[0])
          ? (rel[0] as State[])
          : ((rel ?? []) as State[]);
      }),
    ) as StateRelation<S, K>[];
  }

  limit(limit: number | null | undefined): this {
    this._limit = limit ?? undefined;
    return this;
  }

  offset(offset: EntityListOffset | null | undefined): this {
    this._offset = offset ?? undefined;
    return this;
  }
}
