import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface UpdateFirstQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateFirstAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateFirstAndReturn', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R | undefined> {}
