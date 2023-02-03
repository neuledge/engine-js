import { StateDefinition } from '@/definitions';
import { InitManyAndReturnQuery, InitManyQueryOptions } from './init-many';
import { InitOneAndReturnQuery, InitOneQueryOptions } from './init-one';
import {
  FindFirstOrThrowQuery,
  FindFirstOrThrowQueryOptions,
} from './find-first-or-throw';
import { FindFirstQuery, FindFirstQueryOptions } from './find-first';
import { FindManyQuery, FindManyQueryOptions } from './find-many';
import {
  FindUniqueOrThrowQuery,
  FindUniqueOrThrowQueryOptions,
  FindUniqueWhereOrThrowQuery,
} from './find-unique-or-throw';
import {
  FindUniqueQuery,
  FindUniqueQueryOptions,
  FindUniqueWhereQuery,
} from './find-unique';
import { SelectManyQuery, SelectManyQueryOptions } from './select-many';
import { SelectOneQuery, SelectOneQueryOptions } from './select-one';
import {
  AlterFirstAndReturnOrThrowQuery,
  AlterFirstOrThrowQueryOptions,
} from './alter-first-or-throw';
import {
  AlterFirstAndReturnQuery,
  AlterFirstQueryOptions,
} from './alter-first';
import { AlterManyAndReturnQuery, AlterManyQueryOptions } from './alter-many';
import {
  AlterUniqueAndReturnOrThrowQuery,
  AlterUniqueOrThrowQueryOptions,
  AlterUniqueWhereAndReturnOrThrowQuery,
  AlterUniqueWhereOrThrowQuery,
} from './alter-unique-or-throw';
import {
  AlterUniqueAndReturnQuery,
  AlterUniqueQueryOptions,
  AlterUniqueWhereAndReturnQuery,
  AlterUniqueWhereQuery,
} from './alter-unique';
import { FilterQueryOptions } from './filter';
import { QueryProjection } from './select';

export type Query<
  M extends QueryMode,
  I extends StateDefinition, // input state
  O extends StateDefinition, // output state
  P extends QueryProjection<O> = true, // projection
  R = NonNullable<unknown>, // relations
> = QueryModes<I, O, P, R>[M];

export type QueryOptions<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
> = QueryOptionsTypes<I, O>[T];

export type QueryType = keyof QueryOptionsTypes<never, never>;
export type QueryMode = keyof QueryModes<never, never, never, never>;

interface QueryModes<
  I extends StateDefinition,
  O extends StateDefinition,
  P extends QueryProjection<O>,
  R,
> {
  // AlterMany: never;
  AlterManyAndReturn: AlterManyAndReturnQuery<I, O, P, R>;
  // AlterFirst: never,
  AlterFirstAndReturn: AlterFirstAndReturnQuery<I, O, P, R>;
  // AlterFirstOrThrow: never,
  AlterFirstAndReturnOrThrow: AlterFirstAndReturnOrThrowQuery<I, O, P, R>;
  // AlterUnique: never;
  AlterUniqueAndReturn: AlterUniqueAndReturnQuery<I, O, P, R>;
  AlterUniqueWhere: AlterUniqueWhereQuery<I, O, P, R>;
  AlterUniqueWhereAndReturn: AlterUniqueWhereAndReturnQuery<I, O, P, R>;
  // AlterUniqueOrThrow: never;
  AlterUniqueAndReturnOrThrow: AlterUniqueAndReturnOrThrowQuery<I, O, P, R>;
  AlterUniqueWhereOrThrow: AlterUniqueWhereOrThrowQuery<I, O, P, R>;
  AlterUniqueWhereAndReturnOrThrow: AlterUniqueWhereAndReturnOrThrowQuery<
    I,
    O,
    P,
    R
  >;
  FindMany: FindManyQuery<O, P, R>;
  FindFirst: FindFirstQuery<O, P, R>;
  FindFirstOrThrow: FindFirstOrThrowQuery<O, P, R>;
  FindUnique: FindUniqueQuery<O, P, R>;
  FindUniqueWhere: FindUniqueWhereQuery<O, P, R>;
  FindUniqueOrThrow: FindUniqueOrThrowQuery<O, P, R>;
  FindUniqueWhereOrThrow: FindUniqueWhereOrThrowQuery<O, P, R>;
  // InitMany: never,
  InitManyAndReturn: InitManyAndReturnQuery<O, P, R>;
  // InitOne: never;
  InitOneAndReturn: InitOneAndReturnQuery<O, P, R>;
  SelectMany: SelectManyQuery<O, P, R>;
  SelectOne: SelectOneQuery<O, P, R>;
}

interface QueryOptionsTypes<
  I extends StateDefinition,
  O extends StateDefinition,
> {
  AlterFirstOrThrow: AlterFirstOrThrowQueryOptions<I, O>;
  AlterFirst: AlterFirstQueryOptions<I, O>;
  AlterMany: AlterManyQueryOptions<I, O>;
  AlterUniqueOrThrow: AlterUniqueOrThrowQueryOptions<I, O>;
  AlterUnique: AlterUniqueQueryOptions<I, O>;
  InitMany: InitManyQueryOptions<I, O>;
  InitOne: InitOneQueryOptions<I, O>;
  Filter: FilterQueryOptions<I>;
  FindFirstOrThrow: FindFirstOrThrowQueryOptions<I, O>;
  FindFirst: FindFirstQueryOptions<I, O>;
  FindMany: FindManyQueryOptions<I, O>;
  FindUniqueOrThrow: FindUniqueOrThrowQueryOptions<I, O>;
  FindUnique: FindUniqueQueryOptions<I, O>;
  SelectMany: SelectManyQueryOptions<I, O>;
  SelectOne: SelectOneQueryOptions<I, O>;
}
