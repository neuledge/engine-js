import { Entity } from '@/entity.js';
import { State, StateDeleteMutations } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { MethodQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface DeleteUniqueOrThrowQuery<S extends State>
  extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R> {}

export interface DeleteUniqueWhereOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface DeleteUniqueOrThrowQueryOptions<
  I extends State,
  O extends State,
> extends TypeQueryOptions<'DeleteUniqueOrThrow', I>,
    MethodQueryOptions<StateDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I> {}
