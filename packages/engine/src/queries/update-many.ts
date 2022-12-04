import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

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
