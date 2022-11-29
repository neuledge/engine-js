import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface FindUniqueOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'FindUniqueOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R> {}

export interface FindUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'FindUniqueWhereOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface FindUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUniqueOrThrow', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUniqueOrThrow', I, O> {}
