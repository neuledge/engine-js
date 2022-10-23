import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';
import { FilterQuery } from './filter.js';

export interface FindFirstOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindFirstOrThrow', S, S, R>,
    FilterQuery<S>,
    OffsetQuery,
    ExecQuery<R> {}