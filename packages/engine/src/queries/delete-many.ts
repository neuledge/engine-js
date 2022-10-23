import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { SelectQuery } from './select.js';

export interface DeleteManyQuery<S extends State>
  extends SelectQuery<'DeleteManyAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<void> {}

export interface DeleteManyAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteManyAndReturn', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}
