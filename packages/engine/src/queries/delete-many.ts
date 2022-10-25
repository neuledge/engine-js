import { Entity } from '@/entity.js';
import { State, StateDeleteMutations } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { MethodQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface DeleteManyQuery<S extends State>
  extends SelectQuery<'DeleteManyAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<void> {}

export interface DeleteManyAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteManyAndReturn', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}

export interface DeleteManyQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'DeleteMany', I>,
    MethodQueryOptions<StateDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    LimitQueryOptions {}
