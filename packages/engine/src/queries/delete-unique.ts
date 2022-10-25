import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';

export interface DeleteUniqueQuery<S extends State>
  extends SelectQuery<'DeleteUniqueAndReturn', S, S, Entity<S>>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, Entity<S>> {}

export interface DeleteUniqueAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R> {}

export interface DeleteUniqueWhereQuery<S extends State, R>
  extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhere', S, S, R>,
    ExecQuery<void> {}

export interface DeleteUniqueWhereAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    FilterQuery<S>,
    UniqueQuery<'DeleteUniqueWhereAndReturn', S, S, R>,
    ExecQuery<R | undefined> {}
