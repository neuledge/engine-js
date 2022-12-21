import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionCreateMutations } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface InitOneQuery<S extends StateDefinition>
  extends RetriveQuery<'InitOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface InitOneAndReturnQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'InitOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface InitOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'InitOne', I, O> {
  states: [I];
}
