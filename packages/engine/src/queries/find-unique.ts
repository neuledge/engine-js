import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { FilterQuery, FilterQueryOptions } from './filter';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { RootQueryOptions } from './type';

export interface FindUniqueQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindUnique', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R> {}

export interface FindUniqueWhereQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindUniqueWhere', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R>,
    ExecQuery<R | undefined> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
