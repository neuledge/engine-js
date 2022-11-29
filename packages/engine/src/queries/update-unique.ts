import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionUpdateMutations,
} from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { SingleArgsQueryOptions } from './method.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface UpdateUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R> {}

export interface UpdateUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | undefined> {}

export interface UpdateUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUnique', I, O> {}
