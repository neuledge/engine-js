import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { EntityList } from '@/list';
import {
  ExecQuery,
  ExecQueryOptions,
  MultiArgsQueryOptions,
  PopulateQuery,
  PopulateQueryOptions,
  QueryEntity,
  QueryProjection,
  RootQueryOptions,
  SelectQuery,
  SelectQueryOptions,
} from '../raw';

export interface InitManyQuery<S extends StateDefinition>
  extends SelectQuery<'InitManyAndReturn', S, S>,
    ExecQuery<void> {}

export interface InitManyAndReturnQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = true,
  R = NonNullable<unknown>,
> extends SelectQuery<'InitManyAndReturn', S, S, R>,
    PopulateQuery<'InitManyAndReturn', S, S, P, R>,
    ExecQuery<EntityList<QueryEntity<S, P, R>>> {}

export interface InitManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitMany', I>,
    MultiArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    SelectQueryOptions<O>,
    PopulateQueryOptions<O>,
    ExecQueryOptions<'InitMany', I, O> {
  states: [I];
}
