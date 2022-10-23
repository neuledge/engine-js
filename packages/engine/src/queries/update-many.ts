import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { SelectQuery } from './select.js';

export interface UpdateManyQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateManyAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<void> {}

export interface UpdateManyAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateManyAndReturn', I, O, R>,
    FilterQuery<I>,
    LimitQuery,
    ExecQuery<EntityList<R>> {}
