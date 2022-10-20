import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { FindQuery } from './find.js';

export class FindManyQuery<
  S extends State,
  Result = Entity<S>,
> extends FindQuery<S, Result> {
  exec = this.execMany;
}
