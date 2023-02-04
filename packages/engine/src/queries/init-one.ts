import { StateDefinition, StateDefinitionInitMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { IncludeQuery, IncludeQueryOptions } from './include';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { InitReturnQuery, InitReturnQueryOptions } from './return';

export interface InitOneQuery<S extends StateDefinition>
  extends InitReturnQuery<'InitOneAndReturn', S>,
    ExecQuery<void> {}

export interface InitOneAndReturnQuery<
  S extends StateDefinition,
  P extends QueryProjection<S> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'InitOneAndReturn', S, S, R>,
    IncludeQuery<'InitOneAndReturn', S, S, P, R>,
    ExecQuery<QueryEntity<S, P, R>> {}

export interface InitOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'InitOne', I>,
    SingleArgsQueryOptions<I, StateDefinitionInitMethods<I>>,
    InitReturnQueryOptions,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    ExecQueryOptions<'InitOne', I, O> {
  states: [I];
}
