import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';

export interface UpdateUniqueOrThrowQuery<I extends State, O extends State>
  extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, Entity<O>>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, Entity<O>>,
    ExecQuery<void> {}

export interface UpdateUniqueAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R> {}

export interface UpdateUniqueWhereOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereOrThrow', I, O, R>,
    ExecQuery<void> {}

export interface UpdateUniqueWhereAndReturnOrThrowQuery<
  I extends State,
  O extends State,
  R,
> extends SelectQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    FilterQuery<I>,
    UniqueQuery<'UpdateUniqueWhereAndReturnOrThrow', I, O, R>,
    ExecQuery<R> {}
