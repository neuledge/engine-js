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

export interface UpdateFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R> {}

export interface UpdateFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    SelectQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirstOrThrow', I, O> {}
