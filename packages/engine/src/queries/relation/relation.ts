import { Entity, ProjectedEntity } from '@/entity.js';
import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { Select } from '@/select.js';
import { UniqueWhere, Where } from '@/where.js';
import { EntityRelation } from './entity.js';

export class RelationQuery<
  S extends State,
  Result = Entity<S>,
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

  private clone<Result>(): RelationQuery<S, Result, W> {
    const res = new (this.constructor as {
      new (states: S[]): RelationQuery<S, Result, W>;
    })(this.states);

    res._where = this._where;
    res._select = this._select;
    res._relations = this._relations;
    res._limit = this._limit;
    res._offset = this._offset;

    return res;
  }

  where(where: W | null): this {
    this._where = where ?? undefined;
    return this;
  }

  select<P extends Select<S>>(
    select: P,
  ): RelationQuery<S, ProjectedEntity<S, P>, W> {
    const res = this.clone<ProjectedEntity<S, P> | Entity<S>>();

    res._select = select;
    return res;
  }

  include<K extends keyof StateRelations<S>>(
    key: K,
    states?: undefined | null,
  ): RelationQuery<
    S,
    EntityRelation<S, typeof key, Result, Entity<StateRelation<S, K>>>,
    W
  >;
  include<
    K extends keyof StateRelations<S>,
    RS extends StateRelation<S, K>,
    RR,
  >(
    key: K,
    states: RS[],
    relation: ((rel: RelationQuery<RS>) => RelationQuery<RS, RR>) | null,
  ): RelationQuery<S, EntityRelation<S, typeof key, Result, RR>, W>;
  include<K extends keyof StateRelations<S>, RS extends StateRelation<S, K>>(
    key: K,
    states: RS[],
    relation?: null,
  ): RelationQuery<S, EntityRelation<S, typeof key, Result, Entity<RS>>, W>;
  include<K extends keyof StateRelations<S>, RS extends StateRelation<S, K>>(
    key: K,
    states?: RS[] | null,
    relation?: ((rel: RelationQuery<RS>) => RelationQuery<RS>) | null,
  ): RelationQuery<S, Result, W> {
    if (!states) {
      // eslint-disable-next-line unicorn/prefer-spread
      states = ([] as State[]).concat(
        ...this.states.map((item): State[] => {
          const rel = item.$relations()[key as string];

          return Array.isArray(rel) && Array.isArray(rel[0])
            ? (rel[0] as State[])
            : ((rel ?? []) as State[]);
        }),
      ) as RS[];
    }

    let rel = new RelationQuery<RS>(states);
    if (relation) rel = relation(new RelationQuery<RS>(states));

    const res = this.clone();
    res._relations = { ...res._relations, [key]: rel };

    return res;
  }

  limit(limit: number | null): this {
    this._limit = limit ?? undefined;
    return this;
  }

  offset(offset: EntityListOffset | null): this {
    this._offset = offset ?? undefined;
    return this;
  }
}
