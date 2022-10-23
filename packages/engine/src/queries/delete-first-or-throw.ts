import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface DeleteFirstOrThrowQuery<S extends State>
  extends SelectQuery<'DeleteFirstAndReturnOrThrow', S, S, Entity<S>>,
    FilterQuery<S>,
    ExecQuery<void> {}

export interface DeleteFirstAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteFirstAndReturnOrThrow', S, S, R>,
    FilterQuery<S>,
    ExecQuery<R> {}
