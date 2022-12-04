import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionDeleteMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { MethodQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface DeleteFirstQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteFirstAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteFirstAndReturn', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R | undefined> {}

export interface DeleteFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteFirst', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'DeleteFirst', I, O> {}
