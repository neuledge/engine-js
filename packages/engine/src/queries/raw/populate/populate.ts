import { StateDefinition } from '@/definitions';
import { QueryMode } from '../../query';
import { QueryProjection } from '../select';
import { PopulateOneQuery, PopulateOneQueryOptions } from './one';
import { PopulateManyQuery, PopulateManyQueryOptions } from './many';

export interface PopulateQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = true,
  R = NonNullable<unknown>,
> extends PopulateOneQuery<M, I, O, P, R>,
    PopulateManyQuery<M, I, O, P, R> {}

export interface PopulateQueryOptions<S extends StateDefinition>
  extends PopulateOneQueryOptions<S>,
    PopulateManyQueryOptions<S> {}

export type { PopulateOneQueryParam } from './one';
export type { PopulateManyQueryParam } from './many';
