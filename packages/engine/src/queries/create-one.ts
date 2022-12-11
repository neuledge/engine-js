import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionCreateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface CreateOneQuery<S extends StateDefinition>
  extends RetriveQuery<'CreateOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateOneAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'CreateOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface CreateOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'CreateOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'CreateOne', I, O> {
  states: [I];
}
