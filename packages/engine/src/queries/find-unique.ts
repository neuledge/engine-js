import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { RootQueryOptions } from './type';

export interface FindUniqueQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindUnique', S, S, R>,
    UniqueFilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R> {}

export interface FindUniqueWhereQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindUniqueWhere', S, S, R>,
    UniqueFilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R>,
    ExecQuery<R | null> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
