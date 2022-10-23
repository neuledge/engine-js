import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface DeleteFirstQuery<S extends State>
  extends SelectQuery<'DeleteFirstAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteFirstAndReturn', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R | undefined> {}
