import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { RootQueryOptions } from './type.js';
import { SortQuery, SortQueryOptions } from './sort.js';

export interface FindFirstOrThrowQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'FindFirstOrThrow', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<R> {}

export interface FindFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirstOrThrow', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirstOrThrow', I, O> {}
