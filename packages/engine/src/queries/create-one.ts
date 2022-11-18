import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionCreateMutations,
} from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { SingleArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';

export interface CreateOneQuery<S extends StateDefinition>
  extends SelectQuery<'CreateOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateOneAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'CreateOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface CreateOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'CreateOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    SelectQueryOptions<O>,
    ExecQueryOptions<'CreateOne', I, O> {}
