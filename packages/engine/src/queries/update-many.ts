import { Entity } from '@/entity.js';
import { State, StateUpdateMutations } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface UpdateManyQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateManyAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

export interface UpdateManyAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateManyAndReturn', I, O, R>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}

export interface UpdateManyQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'UpdateMany', I>,
    SingleArgsQueryOptions<I, StateUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    LimitQueryOptions {}
