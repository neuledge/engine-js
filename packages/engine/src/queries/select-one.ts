import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { ChildQueryOptions } from './type.js';

export interface SelectOneQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'SelectOne', S, S, R>,
    FilterQuery<S> {}

export interface SelectOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectOne', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I> {}
