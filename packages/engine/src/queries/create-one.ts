import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { SelectQuery } from './select.js';

export interface CreateOneQuery<S extends State>
  extends SelectQuery<'CreateOneAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateOneAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'CreateOneAndReturn', S, S, R>,
    ExecQuery<R> {}
