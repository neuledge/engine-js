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

export interface DeleteUniqueOrThrowQuery<S extends StateDefinition>
  extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R> {}

export interface DeleteUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface DeleteUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteUniqueOrThrow', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'DeleteUniqueOrThrow', I, O> {}
