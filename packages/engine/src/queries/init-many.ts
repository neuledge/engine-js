import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { MultiArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { SelectQuery, SelectQueryOptions } from './select';

export interface InitManyQuery<S extends StateDefinition>
  extends SelectQuery<'InitManyAndReturn', S, S, Entity<S>>,
    IncludeQuery<'InitManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface InitManyAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends SelectQuery<'InitManyAndReturn', S, S, R>,
    IncludeQuery<'InitManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface InitManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitMany', I>,
    MultiArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    ExecQueryOptions<'InitMany', I, O> {
  states: [I];
}
