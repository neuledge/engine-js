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

export interface DeleteFirstQuery<S extends StateDefinition>
  extends SelectQuery<'DeleteFirstAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'DeleteFirstAndReturn', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R | undefined> {}

export interface DeleteFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteFirst', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'DeleteFirst', I, O> {}
