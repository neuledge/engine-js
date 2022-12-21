import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueFilterQuery, UniqueFilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';

export interface AlterUniqueOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'AlterUniqueAndReturnOrThrow', I, O, Entity<O>>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface AlterUniqueWhereOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereOrThrow', I, O, R>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    UniqueFilterQuery<I>,
    UniqueQuery<'AlterUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}

export interface AlterUniqueOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUniqueOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMutations<I>>,
    RetriveQueryOptions<O>,
    UniqueFilterQueryOptions<I>,
    UniqueQueryOptions<I>,
    ExecQueryOptions<'AlterUniqueOrThrow', I, O> {}
