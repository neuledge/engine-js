import { Entity } from '@/entity.js';
import { State, StateUpdateMutations } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface UpdateFirstOrThrowQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R> {}

export interface UpdateFirstOrThrowQueryOptions<
  I extends State,
  O extends State,
> extends TypeQueryOptions<'UpdateFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirstOrThrow', I, O> {}
