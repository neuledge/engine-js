import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { UniqueWhere } from '@/where.js';
import { FindQuery } from './find.js';

export class FindUniqueQuery<
  S extends State,
  Result = Entity<S>,
> extends FindQuery<S, Result, UniqueWhere<S>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit(limit: 1): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offset(offset: null): this {
    return this;
  }

  exec = this.execFirst;
}

export class FindUniqueOrThrowQuery<
  S extends State,
  Result = Entity<S>,
> extends FindQuery<S, Result, UniqueWhere<S>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit(limit: 1): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offset(offset: null): this {
    return this;
  }

  exec = this.execFirstOrThrow;
}
