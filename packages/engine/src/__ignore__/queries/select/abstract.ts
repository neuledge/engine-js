import { State, StateRelations } from '@/generated/index.js';
import { EntityList, EntityListOffset } from '@/list.js';
import { UniqueWhere, Where } from '../where.js';
import { Select } from './entity.js';
import { SelectRelations, SelectRelationState } from './relations.js';

export abstract class AbstractSelectQuery<
  S extends State,
  W extends Where<S> | UniqueWhere<S> | null | undefined,
  L extends number | null | undefined,
  O extends EntityListOffset | null | undefined,
> {
  constructor(
    protected readonly _states: S[],
    protected _where: W,
    protected _limit: L,
    protected _offset: O,
    protected _select?: Select<S>,
    protected _relations: SelectRelations<S> = {},
  ) {}

  where(where: W): this {
    this._where = where;
    return this;
  }

  limit(limit: L): this {
    this._limit = limit;
    return this;
  }

  offset(offset: O): this {
    this._offset = offset;
    return this;
  }

  // logics

  protected many<R>(res: EntityList<R>): EntityList<R> {
    return res;
  }

  protected first<R>([res]: EntityList<R>): R | undefined {
    return res;
  }

  protected firstOrThrow<R>([res]: EntityList<R>): R {
    if (res == null) {
      // TODO improve error type and message
      throw new ReferenceError(`Can't find entities for ${this.stateNames}`);
    }

    return res;
  }

  // helpers

  protected get stateNames(): string {
    return `'${this._states.map((item) => item.$key).join("', '")}'`;
  }

  protected static relationStates<
    S extends State,
    K extends keyof StateRelations<S>,
    W extends Where<S> | UniqueWhere<S> | null | undefined,
    L extends number | null | undefined,
    O extends EntityListOffset | null | undefined,
  >(
    instance: AbstractSelectQuery<S, W, L, O>,
    key: K,
  ): SelectRelationState<S, K>[] {
    // eslint-disable-next-line unicorn/prefer-spread
    return ([] as State[]).concat(
      ...instance._states.map((item): State[] => {
        const rel = item.$relations()[key as string];

        return Array.isArray(rel) && Array.isArray(rel[0])
          ? (rel[0] as State[])
          : ((rel ?? []) as State[]);
      }),
    ) as SelectRelationState<S, K>[];
  }
}
