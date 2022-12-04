import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { FilterQuery, FilterQueryOptions } from './filter';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { ChildQueryOptions } from './type';

export interface SelectOneQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'SelectOne', S, S, R>,
    FilterQuery<S> {}

export interface SelectOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectOne', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I> {}
