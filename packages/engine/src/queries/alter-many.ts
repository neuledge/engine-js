import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { LimitQuery, LimitQueryOptions } from './limit';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { AlterReturnQuery, AlterReturnQueryOptions } from './return';

export interface AlterManyQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends AlterReturnQuery<'AlterManyAndReturn', I, O>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

export interface AlterManyAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterManyAndReturn', I, O, R>,
    IncludeQuery<'AlterManyAndReturn', I, O, P, R>,
    WhereQuery<I>,
    MatchQuery<I>,
    LimitQuery,
    ExecQuery<QueryEntity<O, P, R>[]> {}

export interface AlterManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterMany', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    AlterReturnQueryOptions,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    LimitQueryOptions,
    ExecQueryOptions<'AlterMany', I, O> {}
