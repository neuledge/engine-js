import { StateDefinition } from '@/definitions';
import {
  AlterFirstMutation,
  AlterFirstOrThrowMutation,
  AlterManyMutation,
  AlterUniqueMutation,
  AlterUniqueOrThrowMutation,
} from './alter';
import { InitManyMutation, InitOneMutation } from './init';

export type Mutation<
  T extends MutationType,
  I extends StateDefinition,
> = MutationTypes<I>[T];

export type MutationType = keyof MutationTypes<never>;

export interface MutationTypes<I extends StateDefinition> {
  InitMany: InitManyMutation<I>;
  InitOne: InitOneMutation<I>;
  AlterMany: AlterManyMutation<I>;
  AlterFirst: AlterFirstMutation<I>;
  AlterFirstOrThrow: AlterFirstOrThrowMutation<I>;
  AlterUnique: AlterUniqueMutation<I>;
  AlterUniqueOrThrow: AlterUniqueOrThrowMutation<I>;
}
