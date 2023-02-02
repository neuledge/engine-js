import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { SortQuery, SortQueryOptions } from './sort';
import { RootQueryOptions } from './type';
import { MatchQuery, MatchQueryOptions } from './match';
import { WhereQuery, WhereQueryOptions } from './where';
import { SelectQuery, SelectQueryOptions } from './select';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export interface FindManyQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'FindMany', S, S, R>,
    IncludeQuery<'FindMany', S, S, R>,
    RequireQuery<'FindMany', S, S, R>,
    WhereQuery<S>,
    MatchQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<R>> {}

export interface FindManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindMany', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions,
    ExecQueryOptions<'FindMany', I, O> {}
