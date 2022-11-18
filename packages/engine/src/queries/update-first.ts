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

export interface UpdateFirstQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'UpdateFirstAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'UpdateFirstAndReturn', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R | undefined> {}

export interface UpdateFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateFirst', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirst', I, O> {}
