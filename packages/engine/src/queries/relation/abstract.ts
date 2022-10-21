import { State, StateRelation, StateRelations } from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { Select } from '@/queries/select.js';
import { UniqueWhere, Where } from '@/queries/where.js';

export abstract class AbstractRelationQuery<
  S extends State,
  W extends Where<S> | UniqueWhere<S> = Where<S>,
  L extends number = number,
  O extends EntityListOffset = EntityListOffset,
> {
  protected _where: W | undefined;
  protected _select: Select<S> | undefined;
  protected _relations: {
    [K in keyof StateRelations<S>]?: AbstractRelationQuery<StateRelation<S, K>>;
  } = {};
  protected _limit: number | undefined;
  protected _offset: EntityListOffset | undefined;

  constructor(public readonly states: S[]) {}

  protected clone<T extends AbstractRelationQuery<S, W, L, O>>(instance: T): T {
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

  limit(limit: L extends 1 ? 1 : L | null | undefined): this {
    this._limit = limit ?? undefined;
    return this;
  }

  offset(offset: O | null | undefined): this {
    this._offset = offset ?? undefined;
    return this;
  }

  // helpers

  protected get stateNames(): string {
    return `'${this.states.map((item) => item.$key).join("', '")}'`;
  }
}
