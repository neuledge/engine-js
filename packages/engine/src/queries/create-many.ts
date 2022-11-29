import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionCreateMutations,
} from '@/definitions/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { MultiArgsQueryOptions } from './method.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';

export interface CreateManyQuery<S extends StateDefinition>
  extends RetriveQuery<'CreateManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateManyAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'CreateManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface CreateManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'CreateMany', I>,
    MultiArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'CreateMany', I, O> {}
