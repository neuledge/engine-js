import { Entity } from '@/entity.js';
import { State, StateUpdateMutations } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface UpdateFirstQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateFirstAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateFirstAndReturn', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R | undefined> {}

export interface UpdateFirstQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'UpdateFirst', I>,
    SingleArgsQueryOptions<I, StateUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I> {}
