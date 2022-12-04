import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { SortQuery, SortQueryOptions } from './sort';
import { RootQueryOptions } from './type';

export interface FindManyQuery<S extends StateDefinition, R = Entity<S>>
  extends RetriveQuery<'FindMany', S, S, R>,
    FilterQuery<S>,
    SortQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<R>> {}

export interface FindManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'FindMany', I>,
    RetriveQueryOptions<O>,
    FilterQueryOptions<O>,
    SortQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions,
    ExecQueryOptions<'FindMany', I, O> {}
