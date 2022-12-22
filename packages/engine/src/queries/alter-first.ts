import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface AlterFirstQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'AlterFirstAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface AlterFirstAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'AlterFirstAndReturn', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R | null> {}

export interface AlterFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterFirst', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'AlterFirst', I, O> {}
