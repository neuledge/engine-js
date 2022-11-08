import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';
import { TypeQueryOptions } from './type.js';

export interface FindUniqueQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUnique', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R> {}

export interface FindUniqueWhereQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhere', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhere', S, S, R>,
    ExecQuery<R | undefined> {}

export interface FindUniqueQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'FindUnique', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    UniqueQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
