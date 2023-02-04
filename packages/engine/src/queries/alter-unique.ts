import { StateDefinition, StateDefinitionAlterMethods } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { SingleArgsQueryOptions } from './method';
import { RootQueryOptions } from './type';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { MatchQuery, MatchQueryOptions } from './match';
import {
  QueryEntity,
  QueryProjection,
  SelectQuery,
  SelectQueryOptions,
} from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { AlterReturnQuery, AlterReturnQueryOptions } from './return';

export interface AlterUniqueQuery<
  I extends StateDefinition,
  O extends StateDefinition,
> extends AlterReturnQuery<'AlterUniqueAndReturn', I, O>,
    UniqueQuery<'AlterUniqueWhere', I, O>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterUniqueAndReturn', I, O, R>,
    IncludeQuery<'AlterUniqueAndReturn', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    MatchQuery<I> {}

export interface AlterUniqueWhereQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> extends AlterReturnQuery<'AlterUniqueWhereAndReturn', I, O>, // P and R are not used here, values are default anyway
    UniqueQuery<'AlterUniqueWhere', I, O, P, R>,
    MatchQuery<I>,
    ExecQuery<void> {}

export interface AlterUniqueWhereAndReturnQuery<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O> = null,
  R = NonNullable<unknown>,
> extends SelectQuery<'AlterUniqueWhereAndReturn', I, O, R>,
    IncludeQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    UniqueQuery<'AlterUniqueWhereAndReturn', I, O, P, R>,
    MatchQuery<I>,
    ExecQuery<QueryEntity<O, P, R> | null> {}

export interface AlterUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'AlterUnique', I>,
    SingleArgsQueryOptions<I, StateDefinitionAlterMethods<I>>,
    AlterReturnQueryOptions,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    UniqueQueryOptions<I>,
    MatchQueryOptions<I>,
    ExecQueryOptions<'AlterUnique', I, O> {}
