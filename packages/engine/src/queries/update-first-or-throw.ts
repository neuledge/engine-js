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

export interface UpdateFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateFirstAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateFirstAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R> {}

export interface UpdateFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirstOrThrow', I, O> {}
