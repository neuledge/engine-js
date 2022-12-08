import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionDeleteMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { MethodQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface DeleteFirstOrThrowQuery<S extends StateDefinition>
  extends RetriveQuery<'DeleteFirstAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<null> {}

export interface DeleteFirstAndReturnOrThrowQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'DeleteFirstAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R> {}

export interface DeleteFirstOrThrowQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'DeleteFirstOrThrow', I>,
    MethodQueryOptions<StateDefinitionDeleteMutations<I>>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<I>,
    ExecQueryOptions<'DeleteFirstOrThrow', I, O> {}
