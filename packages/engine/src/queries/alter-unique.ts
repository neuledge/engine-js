import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface AlterUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'AlterUniqueAndReturn', I, O, Entity<O>>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhere', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, R> {}

export interface AlterUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhere', I, O, R>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | null> {}

export interface AlterUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMutations<I>>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'AlterUnique', I, O> {}
