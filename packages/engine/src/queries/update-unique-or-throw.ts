import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface UpdateUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateUniqueAndReturnOrThrow', I, O, Entity<O>>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface UpdateUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}

export interface UpdateUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUniqueOrThrow', I, O> {}
