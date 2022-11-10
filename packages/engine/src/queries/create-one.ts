import { Entity } from '@/entity.js';
import { State, StateCreateMutations } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';

export interface CreateOneQuery<S extends State>
  extends SelectQuery<'CreateOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateOneAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'CreateOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface CreateOneQueryOptions<I extends State, O extends State>
  extends RootQueryOptions<'CreateOne', I>,
    SingleArgsQueryOptions<I, StateCreateMutations<I>>,
    SelectQueryOptions<O>,
    ExecQueryOptions<'CreateOne', I, O> {}
