import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

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
