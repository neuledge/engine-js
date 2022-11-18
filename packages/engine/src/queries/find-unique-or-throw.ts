import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface FindUniqueOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R> {}

export interface FindUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface FindUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUniqueOrThrow', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUniqueOrThrow', I, O> {}
