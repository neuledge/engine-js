import { State } from '@/generated/index.js';
import { QueryMode } from './query.js';
import { Query } from './query.js';
import { UniqueWhere } from './where.js';

export interface UniqueQuery<
  M extends QueryMode,
  I extends State,
  O extends State,
  R,
> {
  unique(where: UniqueWhere<I>): Query<M, I, O, R>;
}

export interface UniqueQueryOptions<S extends State> {
  unique: UniqueWhere<S> | true;
}
