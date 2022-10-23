import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';

export interface FindFirstQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindFirst', S, S, R>,
    FilterQuery<S>,
    OffsetQuery,
    ExecQuery<R | undefined> {}
