import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { SelectQuery, SelectQueryOptions } from './select';

export interface InitOneQuery<S extends StateDefinition>
  extends SelectQuery<'InitOneAndReturn', S, S, Entity<S>>,
    IncludeQuery<'InitOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface InitOneAndReturnQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'InitOneAndReturn', S, S, R>,
    IncludeQuery<'InitOneAndReturn', S, S, R>,
    ExecQuery<R> {}

export interface InitOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    ExecQueryOptions<'InitOne', I, O> {
  states: [I];
}
