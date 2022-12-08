import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionUpdateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface UpdateFirstOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RetriveQuery<'UpdateFirstAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<null> {}

export interface UpdateFirstAndReturnOrThrowQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  R,
> extends RetriveQuery<'UpdateFirstAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R> {}

export interface UpdateFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'UpdateFirstOrThrow', I>,
    SingleArgsQueryOptions<I, StateDefinitionUpdateMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'UpdateFirstOrThrow', I, O> {}
