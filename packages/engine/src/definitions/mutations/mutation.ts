import { MutatedEntity } from '@/entity';
import { StateDefinition, StateDefinitionType } from '../state';
import { Resolveable } from './utils';

export type MutationDefinitionArguments = Record<string, unknown>;

// top level

export type MutationDefinition<
  S extends StateDefinition = StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> =
  | CreateMutationDefinition<R, A>
  | UpdateMutationDefinition<S, A, R>
  | DeleteMutationDefinition<S>;

// create

export type CreateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
> =
  | CreateWithArgsMutationDefinition<S, A>
  | CreateWithoutArgsMutationDefinition<S>;

export interface CreateWithArgsMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
> {
  readonly mutation: 'create';
  (this: void, args: A): Resolveable<MutatedEntity<S>>;
}

export interface CreateWithoutArgsMutationDefinition<
  S extends StateDefinition,
> {
  readonly mutation: 'create';
  (this: void): Resolveable<MutatedEntity<S>>;
}

// update

export type UpdateMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> =
  | UpdateWithArgsMutationDefinition<S, A, R>
  | UpdateWithoutArgsMutationDefinition<S, R>;

export interface UpdateWithArgsMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
  R extends StateDefinition = StateDefinition,
> {
  readonly mutation: 'update';
  (this: StateDefinitionType<S>, args: A): Resolveable<MutatedEntity<R>>;
}

export interface UpdateWithoutArgsMutationDefinition<
  S extends StateDefinition,
  R extends StateDefinition = StateDefinition,
> {
  readonly mutation: 'update';
  (this: StateDefinitionType<S>): Resolveable<MutatedEntity<R>>;
}

// delete

export type DeleteMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
> =
  | DeleteWithArgsMutationDefinition<S, A>
  | DeleteWithoutArgsMutationDefinition<S>;

export interface DeleteWithArgsMutationDefinition<
  S extends StateDefinition,
  A extends MutationDefinitionArguments = MutationDefinitionArguments,
> {
  readonly mutation: 'delete';
  readonly virtual?: false;
  (this: StateDefinitionType<S>, args: A): Resolveable<void>;
}

export interface DeleteWithoutArgsMutationDefinition<
  S extends StateDefinition,
> {
  readonly mutation: 'delete';
  readonly virtual?: boolean;
  (this: StateDefinitionType<S>): Resolveable<void>;
}
