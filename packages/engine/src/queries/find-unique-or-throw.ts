import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { UniqueFilterQuery } from './filter.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';

export interface FindUniqueOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueOrThrow', S, S, R>,
    UniqueFilterQuery<'FindUniqueWhereOrThrow', S, S, R>,
    OffsetQuery {}

export interface FindUniqueWhereOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhereOrThrow', S, S, R>,
    UniqueFilterQuery<'FindUniqueWhereOrThrow', S, S, R>,
    OffsetQuery,
    ExecQuery<R> {}
