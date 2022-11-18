import { StateDefinition } from '@/definitions/index.js';
import { QueryMode } from './query.js';
import { Query } from './query.js';
import { UniqueWhere } from './where.js';

export interface UniqueQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> {
  unique(where: UniqueWhere<I>): Query<M, I, O, R>;
}

export interface UniqueQueryOptions<S extends StateDefinition> {
  unique: UniqueWhere<S> | true;
}
