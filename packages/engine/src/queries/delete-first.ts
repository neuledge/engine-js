import { Entity } from '@/entity.js';
import { State, StateDeleteMutations } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { MethodQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface DeleteFirstQuery<S extends State>
  extends SelectQuery<'DeleteFirstAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteFirstAndReturn', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R | undefined> {}

export interface DeleteFirstQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'DeleteFirst', I>,
    MethodQueryOptions<StateDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'DeleteFirst', I, O> {}
