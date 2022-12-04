import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { SortQuery, SortQueryOptions } from './sort';
import { ChildQueryOptions } from './type';

export interface SelectManyQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'SelectMany', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery {}

export interface SelectManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectMany', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions {}
