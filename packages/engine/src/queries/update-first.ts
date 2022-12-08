import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface UpdateFirstQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateFirstAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateFirstAndReturn', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R | undefined> {}

export interface UpdateFirstQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateFirst', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirst', I, O> {}
