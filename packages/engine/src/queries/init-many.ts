import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { MultiArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { IncludeQuery, IncludeQueryOptions } from './include';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';

export interface InitManyQuery<S extends StateDefinition>
  extends SelectQuery<'InitManyAndReturn', S, S>,
    IncludeQuery<'InitManyAndReturn', S, S>,
    ExecQuery<void> {}

export interface InitManyAndReturnQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'InitManyAndReturn', S, S, R>,
    IncludeQuery<'InitManyAndReturn', S, S, P, R>,
    ExecQuery<EntityList<QueryEntity<S, P, R>>> {}

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
