import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface UpdateUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, Entity<O>>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R> {}

export interface UpdateUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | undefined> {}

export interface UpdateUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'UpdateUnique', I, O> {}
