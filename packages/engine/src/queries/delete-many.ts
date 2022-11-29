import { Entity } from '@/entity.js';
import {
  StateDefinition,
  StateDefinitionDeleteMutations,
} from '@/definitions/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { MethodQueryOptions } from './method.js';
import { RetriveQuery, RetriveQueryOptions } from './retrive.js';
import { RootQueryOptions } from './type.js';

export interface DeleteManyQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteManyAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<void> {}

export interface DeleteManyAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteManyAndReturn', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}

export interface DeleteManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteMany', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    LimitQueryOptions,
    ExecQueryOptions<'DeleteMany', I, O> {}
