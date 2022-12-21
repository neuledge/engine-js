import { Entity } from '@/entity';
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
import { MatchQueryOptions } from './match';
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
  // AlterMany: never;
  AlterManyAndReturn: AlterManyAndReturnQuery<I, O, R>;
  // AlterFirst: never,
  AlterFirstAndReturn: AlterFirstAndReturnQuery<I, O, R>;
  // AlterFirstOrThrow: never,
  AlterFirstAndReturnOrThrow: AlterFirstAndReturnOrThrowQuery<I, O, R>;
  // AlterUnique: never;
  AlterUniqueAndReturn: AlterUniqueAndReturnQuery<I, O, R>;
  AlterUniqueWhere: AlterUniqueWhereQuery<I, O, R>;
  AlterUniqueWhereAndReturn: AlterUniqueWhereAndReturnQuery<I, O, R>;
  // AlterUniqueOrThrow: never;
  AlterUniqueAndReturnOrThrow: AlterUniqueAndReturnOrThrowQuery<I, O, R>;
  AlterUniqueWhereOrThrow: AlterUniqueWhereOrThrowQuery<I, O, R>;
  AlterUniqueWhereAndReturnOrThrow: AlterUniqueWhereAndReturnOrThrowQuery<
    I,
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
  // InitMany: never,
  InitManyAndReturn: InitManyAndReturnQuery<O, R>;
  // InitOne: never;
  InitOneAndReturn: InitOneAndReturnQuery<O, R>;
  SelectMany: SelectManyQuery<O, R>;
  SelectOne: SelectOneQuery<O, R>;
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
  Match: MatchQueryOptions<I>;
  FindFirstOrThrow: FindFirstOrThrowQueryOptions<I, O>;
  FindFirst: FindFirstQueryOptions<I, O>;
  FindMany: FindManyQueryOptions<I, O>;
  FindUniqueOrThrow: FindUniqueOrThrowQueryOptions<I, O>;
  FindUnique: FindUniqueQueryOptions<I, O>;
  SelectMany: SelectManyQueryOptions<I, O>;
  SelectOne: SelectOneQueryOptions<I, O>;
}
