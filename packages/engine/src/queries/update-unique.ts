import { Entity } from '@/entity.js';
import { State, StateUpdateMutations } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface UpdateUniqueQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateUniqueAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateUniqueAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R> {}

export interface UpdateUniqueWhereQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | undefined> {}

export interface UpdateUniqueQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'UpdateUnique', I>,
    SingleArgsQueryOptions<I, StateUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUnique', I, O> {}
