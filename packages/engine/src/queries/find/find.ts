import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { createEntityList, EntityList, EntityListOffset } from '@/list.js';
import { Select } from '@/select.js';
import { UniqueWhere, Where } from '@/where.js';
import { RelationQuery } from '../relation/relation.js';

export abstract class FindQuery<
  S extends State,
  Result = Entity<S>,
  W extends Where<S> | UniqueWhere<S> = Where<S>,
> extends RelationQuery<S, Result, W> {
  protected _where: W | undefined;
  protected _select: Select<S> | undefined;
  protected _limit: number | undefined;
  protected _offset: EntityListOffset | undefined;

  // exec variants

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async execMany(limit: number): Promise<EntityList<Result>> {
    // TODO implement find.execMany()
    return createEntityList([], null);
  }

  protected async execFirst(): Promise<Result | undefined> {
    const [res] = await this.execMany(1);
    return res;
  }

  protected async execFirstOrThrow(): Promise<Result> {
    const res = await this.execFirst();

    if (!res) {
      // TODO improve error type and message
      throw new Error(`Can't find entries`);
    }

    return res;
  }
}
