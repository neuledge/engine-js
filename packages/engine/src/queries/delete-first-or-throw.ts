import { Entity } from '@/entity.js';
import { State, StateDeleteMutations } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { MethodQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface DeleteFirstOrThrowQuery<S extends State>
  extends SelectQuery<'DeleteFirstAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteFirstAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R> {}

export interface DeleteFirstOrThrowQueryOptions<
  I extends State,
  O extends State,
> extends TypeQueryOptions<'DeleteFirstOrThrow', I>,
    MethodQueryOptions<StateDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I> {}
