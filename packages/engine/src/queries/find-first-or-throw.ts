import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { FilterQuery, FilterQueryOptions } from './filter';
import { RootQueryOptions } from './type';
import { SortQuery, SortQueryOptions } from './sort';

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
