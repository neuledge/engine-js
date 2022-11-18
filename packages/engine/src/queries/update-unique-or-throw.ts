import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionUpdateMutations,
} from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface UpdateUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface UpdateUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}

export interface UpdateUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUniqueOrThrow', I, O> {}
