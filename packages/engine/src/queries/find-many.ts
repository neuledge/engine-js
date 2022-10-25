import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface FindManyQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindMany', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<R>> {}

export interface FindManyQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'FindMany', I>,
    SelectQueryOptions<O>,
    FilterQueryOptions<O>,
    LimitQueryOptions,
    OffsetQueryOptions {}
