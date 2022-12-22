import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { MultiArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface InitManyQuery<S extends StateDefinition>
  extends RetriveQuery<'InitManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface InitManyAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'InitManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface InitManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitMany', I>,
    MultiArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'InitMany', I, O> {
  states: [I];
}
