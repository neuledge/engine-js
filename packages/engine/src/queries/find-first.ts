import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { SortQuery, SortQueryOptions } from './sort';
import { RootQueryOptions } from './type';

export interface FindFirstQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindFirst', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    OffsetQuery,
    ExecQuery<R | undefined> {}

export interface FindFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindFirst', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirst', I, O> {}
