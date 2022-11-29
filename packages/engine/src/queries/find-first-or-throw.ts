import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { RootQueryOptions } from './type.js';
import { SortQuery, SortQueryOptions } from './sort.js';

export interface FindFirstOrThrowQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindFirstOrThrow', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<R> {}

export interface FindFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirstOrThrow', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirstOrThrow', I, O> {}
