import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface UpdateUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateUniqueAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<null> {}

export interface UpdateUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface UpdateUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, R>,
    ExecQuery<null> {}

export interface UpdateUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}

export interface UpdateUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUniqueOrThrow', I, O> {}
