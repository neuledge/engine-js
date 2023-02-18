import { StateDefinition } from '@/definitions';
import { QueryMode } from '../../query';
import { QueryProjection } from '../select';
import { PopulateOneQuery, PopulateOneQueryOptions } from './one';

// TODO enable populate many support

export type PopulateQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> = PopulateOneQuery<M, I, O, P, R>;
// , PopulateManyQuery<M, I, O, P, R> {}

export type PopulateQueryOptions<S extends StateDefinition> =
  PopulateOneQueryOptions<S>;
// ,  PopulateManyQueryOptions<S> {}

export type { PopulateOneQueryParam } from './one';
export type { PopulateManyQueryParam } from './many';
