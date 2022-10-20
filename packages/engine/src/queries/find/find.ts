import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { createEntityList, EntityList, EntityListOffset } from '@/list.js';
import { Select } from '@/queries/select.js';
import { UniqueWhere, Where } from '@/queries/where.js';
import { RelationQuery } from '../relation/relation.js';

const EXEC_MAX_DEFAULT_LIMIT = 101;

export abstract class FindQuery<
  S extends State,
  Result = Entity<S>,
  W extends Where<S> | UniqueWhere<S> = Where<S>,
> extends RelationQuery<S, Result, W> {
  protected _where: W | undefined;
  protected _select: Select<S> | undefined;
  protected _limit: number | undefined;
  protected _offset: EntityListOffset | undefined;

  // helpers

  private get stateNames(): string {
    return `'${this.states.map((item) => item.$key).join("', '")}'`;
  }

  // exec variants

  protected execThen<T>(exec: (this: this) => Promise<T>): Promise<T>['then'] {
    return (resolve, reject) => exec.call(this).then(resolve, reject);
  }

  protected async execMany(): Promise<EntityList<Result>> {
    const res = await this.execLimited(this._limit ?? EXEC_MAX_DEFAULT_LIMIT);

    if (res.length >= EXEC_MAX_DEFAULT_LIMIT) {
      throw new RangeError(
        `Too many entities requested without a limit for ${this.stateNames}`,
      );
    }

    return res;
  }

  protected async execFirst(): Promise<Result | undefined> {
    const [res] = await this.execLimited(1);
    return res;
  }

  protected async execFirstOrThrow(): Promise<Result> {
    const res = await this.execFirst();

    if (!res) {
      // TODO improve error type and message
      throw new ReferenceError(
        `Can't find ${JSON.stringify(this._where)} for ${this.stateNames}`,
      );
    }

    return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async execLimited(limit: number): Promise<EntityList<Result>> {
    // TODO implement find.execMany()
    return createEntityList([], null);
  }
}
