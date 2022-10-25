import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';

export interface UpdateUniqueQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateUniqueAndReturn', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateUniqueAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R> {}

export interface UpdateUniqueWhereQuery<I extends State, O extends State, R>
  extends SelectQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhere', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturn', I, O, R>,
    ExecQuery<R | undefined> {}
