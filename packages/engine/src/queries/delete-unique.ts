import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionDeleteMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { MethodQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface DeleteUniqueQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteUniqueAndReturn', S, S, Entity<S>>,
    UniqueFilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteUniqueAndReturn', S, S, R>,
    UniqueFilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R> {}

export interface DeleteUniqueWhereQuery<S extends StateDefinition, R>
  extends RetriveQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    UniqueFilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    UniqueFilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    ExecQuery<R | undefined> {}

export interface DeleteUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteUnique', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'DeleteUnique', I, O> {}
