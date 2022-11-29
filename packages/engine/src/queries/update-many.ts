import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionUpdateMutations,
} from '@/definitions/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { SingleArgsQueryOptions } from './method.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';

export interface UpdateManyQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateManyAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

export interface UpdateManyAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateManyAndReturn', I, O, R>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}

export interface UpdateManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateMany', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    LimitQueryOptions,
    ExecQueryOptions<'UpdateMany', I, O> {}
