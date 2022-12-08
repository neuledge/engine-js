import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionDeleteMutations } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { MethodQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface DeleteManyQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteManyAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<null> {}

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
