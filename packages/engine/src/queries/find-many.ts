import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';

export interface FindManyQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindMany', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    OffsetQuery,
    ExecQuery<EntityList<R>> {}
