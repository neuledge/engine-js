import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';
import { RootQueryOptions } from './type.js';

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
