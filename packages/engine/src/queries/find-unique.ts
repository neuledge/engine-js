import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';
import { UniqueFilterQuery } from './filter.js';

export interface FindUniqueQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUnique', S, S, R>,
    UniqueFilterQuery<'FindUniqueWhere', S, S, R>,
    OffsetQuery {}

export interface FindUniqueWhereQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'FindUniqueWhere', S, S, R>,
    UniqueFilterQuery<'FindUniqueWhere', S, S, R>,
    OffsetQuery,
    ExecQuery<R | undefined> {}
