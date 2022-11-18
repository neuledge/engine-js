import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { SortQuery, SortQueryOptions } from './sort.js';
import { ChildQueryOptions } from './type.js';

export interface SelectManyQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'SelectMany', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery {}

export interface SelectManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectMany', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions {}
