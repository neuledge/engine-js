import { StateDefinition } from '@/definitions';
import { QueryMode } from './query';
import { Query } from './query';
import { UniqueWhere } from './where';

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
