import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface FindUniqueOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R> {}

export interface FindUniqueWhereOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface FindUniqueOrThrowQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'FindUniqueOrThrow', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUniqueOrThrow', I, O> {}
