import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionDeleteMutations,
} from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { MethodQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';

export interface DeleteUniqueQuery<S extends StateDefinition>
  extends SelectQuery<'DeleteUniqueAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R> {}

export interface DeleteUniqueWhereQuery<S extends StateDefinition, R>
  extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    ExecQuery<R | undefined> {}

export interface DeleteUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteUnique', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'DeleteUnique', I, O> {}
