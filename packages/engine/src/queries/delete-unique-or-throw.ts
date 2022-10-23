import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { UniqueFilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface DeleteUniqueOrThrowQuery<S extends State>
  extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, Entity<S>>,
    UniqueFilterQuery<'DeleteUniqueWhereOrThrow', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueAndReturnOrThrow', S, S, R>,
    UniqueFilterQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R> {}

export interface DeleteUniqueWhereOrThrowQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, Entity<S>>,
    UniqueFilterQuery<'DeleteUniqueWhereOrThrow', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnOrThrowQuery<
  S extends State,
  R = Entity<S>,
> extends SelectQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    UniqueFilterQuery<'DeleteUniqueWhereAndReturnOrThrow', S, S, R>,
    ExecQuery<R> {}
