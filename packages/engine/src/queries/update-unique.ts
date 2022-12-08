import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface UpdateUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, Entity<O>>,
    ExecQuery<null> {}

export interface UpdateUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R> {}

export interface UpdateUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, R>,
    ExecQuery<null> {}

export interface UpdateUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | undefined> {}

export interface UpdateUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUnique', I, O> {}
