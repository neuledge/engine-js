import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { SortQuery, SortQueryOptions } from './sort.js';
import { TypeQueryOptions } from './type.js';

export interface FindFirstQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindFirst', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<R | undefined> {}

export interface FindFirstQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'FindFirst', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirst', I, O> {}
