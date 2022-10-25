import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';

export interface FindUniqueOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    OffsetQuery {}

export interface FindUniqueWhereOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'FindUniqueWhereOrThrow', S, S, R>,
    OffsetQuery,
    ExecQuery<R> {}
