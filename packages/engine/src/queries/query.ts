import { Entity } from '@/entity.js';
import { StateDefinition } from '@/definitions/index.js';
import {
  CreateManyAndReturnQuery,
  CreateManyQueryOptions,
} from './create-many.js';
import {
  CreateOneAndReturnQuery,
  CreateOneQueryOptions,
} from './create-one.js';
import {
  DeleteFirstAndReturnOrThrowQuery,
  DeleteFirstOrThrowQueryOptions,
} from './delete-first-or-throw.js';
import {
  DeleteFirstAndReturnQuery,
  DeleteFirstQueryOptions,
} from './delete-first.js';
import {
  DeleteManyAndReturnQuery,
  DeleteManyQueryOptions,
} from './delete-many.js';
import {
  DeleteUniqueAndReturnOrThrowQuery,
  DeleteUniqueOrThrowQueryOptions,
  DeleteUniqueWhereAndReturnOrThrowQuery,
  DeleteUniqueWhereOrThrowQuery,
} from './delete-unique-or-throw.js';
import {
  DeleteUniqueAndReturnQuery,
  DeleteUniqueQueryOptions,
  DeleteUniqueWhereAndReturnQuery,
  DeleteUniqueWhereQuery,
} from './delete-unique.js';
import {
  FindFirstOrThrowQuery,
  FindFirstOrThrowQueryOptions,
} from './find-first-or-throw.js';
import { FindFirstQuery, FindFirstQueryOptions } from './find-first.js';
import { FindManyQuery, FindManyQueryOptions } from './find-many.js';
import {
  FindUniqueOrThrowQuery,
  FindUniqueOrThrowQueryOptions,
  FindUniqueWhereOrThrowQuery,
} from './find-unique-or-throw.js';
import {
  FindUniqueQuery,
  FindUniqueQueryOptions,
  FindUniqueWhereQuery,
} from './find-unique.js';
import { MatchQueryOptions } from './match.js';
import { SelectManyQuery, SelectManyQueryOptions } from './select-many.js';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one.js';
import {
  UpdateFirstAndReturnOrThrowQuery,
  UpdateFirstOrThrowQueryOptions,
} from './update-first-or-throw.js';
import {
  UpdateFirstAndReturnQuery,
  UpdateFirstQueryOptions,
} from './update-first.js';
import {
  UpdateManyAndReturnQuery,
  UpdateManyQueryOptions,
} from './update-many.js';
import {
  UpdateUniqueAndReturnOrThrowQuery,
  UpdateUniqueOrThrowQueryOptions,
  UpdateUniqueWhereAndReturnOrThrowQuery,
  UpdateUniqueWhereOrThrowQuery,
} from './update-unique-or-throw.js';
import {
  UpdateUniqueAndReturnQuery,
  UpdateUniqueQueryOptions,
  UpdateUniqueWhereAndReturnQuery,
  UpdateUniqueWhereQuery,
} from './update-unique.js';

export type Query<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
  R = Entity<O>,
> = QueryModes<I, O, R>[M];

export type QueryOptions<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
> = QueryOptionsTypes<I, O>[T];

export type QueryType = keyof QueryOptionsTypes<never, never>;
export type QueryMode = keyof QueryModes<never, never, never>;

interface QueryModes<I extends StateDefinition, O extends StateDefinition, R> {
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

interface QueryOptionsTypes<
  I extends StateDefinition,
  O extends StateDefinition,
> {
  CreateMany: CreateManyQueryOptions<I, O>;
  CreateOne: CreateOneQueryOptions<I, O>;
  DeleteFirstOrThrow: DeleteFirstOrThrowQueryOptions<I, O>;
  DeleteFirst: DeleteFirstQueryOptions<I, O>;
  DeleteMany: DeleteManyQueryOptions<I, O>;
  DeleteUniqueOrThrow: DeleteUniqueOrThrowQueryOptions<I, O>;
  DeleteUnique: DeleteUniqueQueryOptions<I, O>;
  Match: MatchQueryOptions<I>;
  FindFirstOrThrow: FindFirstOrThrowQueryOptions<I, O>;
  FindFirst: FindFirstQueryOptions<I, O>;
  FindMany: FindManyQueryOptions<I, O>;
  FindUniqueOrThrow: FindUniqueOrThrowQueryOptions<I, O>;
  FindUnique: FindUniqueQueryOptions<I, O>;
  SelectMany: SelectManyQueryOptions<I, O>;
  SelectOne: SelectOneQueryOptions<I, O>;
  UpdateFirstOrThrow: UpdateFirstOrThrowQueryOptions<I, O>;
  UpdateFirst: UpdateFirstQueryOptions<I, O>;
  UpdateMany: UpdateManyQueryOptions<I, O>;
  UpdateUniqueOrThrow: UpdateUniqueOrThrowQueryOptions<I, O>;
  UpdateUnique: UpdateUniqueQueryOptions<I, O>;
}
