import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { FindQuery } from './find.js';

export class FindFirstQuery<
  S extends State,
  Result = Entity<S>,
> extends FindQuery<S, Result> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit(limit: 1): this {
    return this;
  }

  exec = this.execFirst;
}

export class FindFirstOrThrowQuery<
  S extends State,
  Result = Entity<S>,
> extends FindQuery<S, Result> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit(limit: 1): this {
    return this;
  }

  exec = this.execFirstOrThrow;
}
