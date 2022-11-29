import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionCreateMutations,
} from '@/definitions/index.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { SingleArgsQueryOptions } from './method.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';

export interface CreateOneQuery<S extends StateDefinition>
  extends RetriveQuery<'CreateOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateOneAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'CreateOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface CreateOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'CreateOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'CreateOne', I, O> {}
