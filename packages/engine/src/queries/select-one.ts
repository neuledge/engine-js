import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { ChildQueryOptions } from './type.js';

export interface SelectOneQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'SelectOne', S, S, R>,
    FilterQuery<S> {}

export interface SelectOneQueryOptions<I extends State, O extends State>
  extends ChildQueryOptions<'SelectOne', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I> {}
