import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { UniqueFilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface DeleteUniqueQuery<S extends State>
  extends SelectQuery<'DeleteUniqueAndReturn', S, S, Entity<S>>,
    UniqueFilterQuery<'DeleteUniqueWhere', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueAndReturn', S, S, R>,
    UniqueFilterQuery<'DeleteUniqueWhereAndReturn', S, S, R> {}

export interface DeleteUniqueWhereQuery<S extends State, R>
  extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    UniqueFilterQuery<'DeleteUniqueWhere', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    UniqueFilterQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    ExecQuery<R | undefined> {}
