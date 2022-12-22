import { MutatedEntity } from '@/entity';
import { StateDefinition, StateDefinitionType } from '../state';
import {
  CreateWithArgsMutationDefinition,
  CreateWithoutArgsMutationDefinition,
  DeleteWithArgsMutationDefinition,
  DeleteWithoutArgsMutationDefinition,
  MutationDefinition,
  MutationDefinitionArguments,
  UpdateWithArgsMutationDefinition,
  UpdateWithoutArgsMutationDefinition,
} from './mutation';
import { Resolveable } from './utils';

export function createMutation<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
>(
  type: 'create',
  mutation: (this: void, args: A) => Resolveable<MutatedEntity<S>>,
): CreateWithArgsMutationDefinition<S, A>;
export function createMutation<S extends StateDefinition>(
  type: 'create',
  mutation: (this: void) => Resolveable<MutatedEntity<S>>,
): CreateWithoutArgsMutationDefinition<S>;
export function createMutation<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
  R extends StateDefinition,
>(
  type: 'update',
  mutation: (
    this: StateDefinitionType<S>,
    args: A,
  ) => Resolveable<MutatedEntity<R>>,
): UpdateWithArgsMutationDefinition<S, A, R>;
export function createMutation<
  S extends StateDefinition,
  R extends StateDefinition,
>(
  type: 'update',
  mutation: (this: StateDefinitionType<S>) => Resolveable<MutatedEntity<R>>,
): UpdateWithoutArgsMutationDefinition<S, R>;
export function createMutation<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
>(
  type: 'delete',
  mutation: (this: StateDefinitionType<S>, args: A) => Resolveable<void>,
): DeleteWithArgsMutationDefinition<S, A>;
export function createMutation<S extends StateDefinition>(
  type: 'delete',
  mutation?: (this: StateDefinitionType<S>) => Resolveable<void>,
): DeleteWithoutArgsMutationDefinition<S>;
// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function createMutation<
  S extends StateDefinition,
  A extends MutationDefinitionArguments,
  R extends StateDefinition,
>(
  type: 'create' | 'update' | 'delete',
  mutation?: (
    this: StateDefinitionType<S> | void,
    args?: A,
  ) => Resolveable<MutatedEntity<R> | void>,
): MutationDefinition<S, A, R> {
  return Object.assign(mutation ?? ((): void => undefined), {
    mutation: type,
    virtual: !mutation,
  }) as MutationDefinition<S, A, R>;
}
