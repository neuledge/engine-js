import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface UpdateFirstOrThrowQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    ExecQuery<void> {}

export interface UpdateFirstAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateFirstAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    ExecQuery<R> {}
