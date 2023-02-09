import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import {
  ExecQuery,
  ExecQueryOptions,
  PopulateQuery,
  PopulateQueryOptions,
  QueryEntity,
  QueryProjection,
  RootQueryOptions,
  SelectQuery,
  SelectQueryOptions,
  SingleArgsQueryOptions,
} from '../raw';

export interface InitOneQuery<S extends StateDefinition>
  extends SelectQuery<'InitOneAndReturn', S, S>,
    ExecQuery<void> {}

export interface InitOneAndReturnQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'InitOneAndReturn', S, S, R>,
    PopulateQuery<'InitOneAndReturn', S, S, P, R>,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface InitOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    SelectQueryOptions<O>,
    PopulateQueryOptions<O>,
    ExecQueryOptions<'InitOne', I, O> {
  states: [I];
}
