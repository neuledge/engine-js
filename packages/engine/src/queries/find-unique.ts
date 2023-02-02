import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ExecQuery, ExecQueryOptions } from './exec';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { RootQueryOptions } from './type';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import { SelectQuery, SelectQueryOptions } from './select';

export interface FindUniqueQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'FindUnique', S, S, R>,
    IncludeQuery<'FindUnique', S, S, R>,
    RequireQuery<'FindUnique', S, S, R>,
    UniqueQuery<'FindUniqueWhere', S, S, R>,
    MatchQuery<S> {}

export interface FindUniqueWhereQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhere', S, S, R>,
    IncludeQuery<'FindUniqueWhere', S, S, R>,
    RequireQuery<'FindUniqueWhere', S, S, R>,
    UniqueQuery<'FindUniqueWhere', S, S, R>,
    MatchQuery<S>,
    ExecQuery<R | null> {}

export interface FindUniqueQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindUnique', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    UniqueQueryOptions<O>,
    MatchQueryOptions<O>,
    ExecQueryOptions<'FindUnique', I, O> {}
