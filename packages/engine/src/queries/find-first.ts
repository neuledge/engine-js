import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { SortQuery, SortQueryOptions } from './sort.js';
import { RootQueryOptions } from './type.js';

export interface FindFirstQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'FindFirst', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<R | undefined> {}

export interface FindFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirst', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirst', I, O> {}
