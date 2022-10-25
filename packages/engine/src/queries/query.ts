import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { CreateManyAndReturnQuery } from './create-many.js';
import { CreateOneAndReturnQuery } from './create-one.js';
import { DeleteFirstAndReturnOrThrowQuery } from './delete-first-or-throw.js';
import { DeleteFirstAndReturnQuery } from './delete-first.js';
import { DeleteManyAndReturnQuery } from './delete-many.js';
import {
  DeleteUniqueAndReturnOrThrowQuery,
  DeleteUniqueWhereAndReturnOrThrowQuery,
  DeleteUniqueWhereOrThrowQuery,
} from './delete-unique-or-throw.js';
import {
  DeleteUniqueAndReturnQuery,
  DeleteUniqueWhereAndReturnQuery,
  DeleteUniqueWhereQuery,
} from './delete-unique.js';
import { FindFirstOrThrowQuery } from './find-first-or-throw.js';
import { FindFirstQuery } from './find-first.js';
import { FindManyQuery } from './find-many.js';
import {
  FindUniqueOrThrowQuery,
  FindUniqueWhereOrThrowQuery,
} from './find-unique-or-throw.js';
import { FindUniqueQuery, FindUniqueWhereQuery } from './find-unique.js';
import { SelectManyQuery } from './select-many.js';
import { SelectOneQuery } from './select-one.js';
import { UpdateFirstAndReturnOrThrowQuery } from './update-first-or-throw.js';
import { UpdateFirstAndReturnQuery } from './update-first.js';
import { UpdateManyAndReturnQuery } from './update-many.js';
import {
  UpdateUniqueAndReturnOrThrowQuery,
  UpdateUniqueWhereAndReturnOrThrowQuery,
  UpdateUniqueWhereOrThrowQuery,
} from './update-unique-or-throw.js';
import {
  UpdateUniqueAndReturnQuery,
  UpdateUniqueWhereAndReturnQuery,
  UpdateUniqueWhereQuery,
} from './update-unique.js';

export type Query<
  M extends QueryMode,
  I extends State,
  O extends State,
  R = Entity<O>,
> = QueryModes<I, O, R>[M];

export type QueryType =
  | 'CreateMany'
  | 'CreateOne'
  | 'DeleteMany'
  | 'DeleteFirst'
  | 'DeleteFirstOrThrow'
  | 'DeleteUnique'
  | 'DeleteUniqueOrThrow'
  | 'FindMany'
  | 'FindFirst'
  | 'FindFirstOrThrow'
  | 'FindUnique'
  | 'FindUniqueOrThrow'
  | 'UpdateMany'
  | 'UpdateFirst'
  | 'UpdateFirstOrThrow'
  | 'UpdateUnique'
  | 'UpdateUniqueOrThrow';

export type QueryMode = keyof QueryModes<never, never, never>;

export interface QueryModes<I extends State, O extends State, R> {
  // CreateMany: never,
  CreateManyAndReturn: CreateManyAndReturnQuery<O, R>;
  // CreateOne: never;
  CreateOneAndReturn: CreateOneAndReturnQuery<O, R>;
  // DeleteMany: never,
  DeleteManyAndReturn: DeleteManyAndReturnQuery<O, R>;
  // DeleteFirst: never,
  DeleteFirstAndReturn: DeleteFirstAndReturnQuery<O, R>;
  // DeleteFirstOrThrow: never,
  DeleteFirstAndReturnOrThrow: DeleteFirstAndReturnOrThrowQuery<O, R>;
  // DeleteUnique: never,
  DeleteUniqueAndReturn: DeleteUniqueAndReturnQuery<O, R>;
  DeleteUniqueWhere: DeleteUniqueWhereQuery<O, R>;
  DeleteUniqueWhereAndReturn: DeleteUniqueWhereAndReturnQuery<O, R>;
  // DeleteUniqueOrThrow: never,
  DeleteUniqueAndReturnOrThrow: DeleteUniqueAndReturnOrThrowQuery<O, R>;
  DeleteUniqueWhereOrThrow: DeleteUniqueWhereOrThrowQuery<O, R>;
  DeleteUniqueWhereAndReturnOrThrow: DeleteUniqueWhereAndReturnOrThrowQuery<
    O,
    R
  >;
  FindMany: FindManyQuery<O, R>;
  FindFirst: FindFirstQuery<O, R>;
  FindFirstOrThrow: FindFirstOrThrowQuery<O, R>;
  FindUnique: FindUniqueQuery<O, R>;
  FindUniqueWhere: FindUniqueWhereQuery<O, R>;
  FindUniqueOrThrow: FindUniqueOrThrowQuery<O, R>;
  FindUniqueWhereOrThrow: FindUniqueWhereOrThrowQuery<O, R>;
  SelectMany: SelectManyQuery<O, R>;
  SelectOne: SelectOneQuery<O, R>;
  // UpdateMany: never;
  UpdateManyAndReturn: UpdateManyAndReturnQuery<I, O, R>;
  // UpdateFirst: never,
  UpdateFirstAndReturn: UpdateFirstAndReturnQuery<I, O, R>;
  // UpdateFirstOrThrow: never,
  UpdateFirstAndReturnOrThrow: UpdateFirstAndReturnOrThrowQuery<I, O, R>;
  // UpdateUnique: never;
  UpdateUniqueAndReturn: UpdateUniqueAndReturnQuery<I, O, R>;
  UpdateUniqueWhere: UpdateUniqueWhereQuery<I, O, R>;
  UpdateUniqueWhereAndReturn: UpdateUniqueWhereAndReturnQuery<I, O, R>;
  // UpdateUniqueOrThrow: never;
  UpdateUniqueAndReturnOrThrow: UpdateUniqueAndReturnOrThrowQuery<I, O, R>;
  UpdateUniqueWhereOrThrow: UpdateUniqueWhereOrThrowQuery<I, O, R>;
  UpdateUniqueWhereAndReturnOrThrow: UpdateUniqueWhereAndReturnOrThrowQuery<
    I,
    O,
    R
  >;
}
