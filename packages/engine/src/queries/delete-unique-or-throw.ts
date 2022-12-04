import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionDeleteMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { MethodQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface DeleteUniqueOrThrowQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteUniqueAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteUniqueAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R> {}

export interface DeleteUniqueWhereOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereOrThrow', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    ExecQuery<R> {}

export interface DeleteUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteUniqueOrThrow', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'DeleteUniqueOrThrow', I, O> {}
