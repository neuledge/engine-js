import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { TypeQueryOptions } from './type.js';

export interface FindFirstOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindFirstOrThrow', S, S, R>,
    FilterQuery<S>,
    OffsetQuery,
    ExecQuery<R> {}

export interface FindFirstOrThrowQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'FindFirstOrThrow', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    OffsetQueryOptions,
    ExecQueryOptions<'FindFirstOrThrow', I, O> {}
