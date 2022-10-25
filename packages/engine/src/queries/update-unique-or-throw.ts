import { Entity } from '@/entity.js';
import { State, StateUpdateMutations } from '@/generated/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface UpdateUniqueOrThrowQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface UpdateUniqueWhereOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}

export interface UpdateUniqueOrThrowQueryOptions<
  I extends State,
  O extends State,
> extends TypeQueryOptions<'UpdateUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUniqueOrThrow', I, O> {}
