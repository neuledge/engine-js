import { EngineStore } from './store.js';
import {
  createEntityList,
  Entity,
  EntityList,
  FindFirstOptions,
  FindManyOptions,
  FindUniqueOptions,
  MutateOneOptions,
  MutateManyOptions,
  MutateUniqueOptions,
  MutationState,
  State,
  MutationSelect,
  MutateUniqueProjectOptions,
  MutateOneProjectOptions,
  MutateManyProjectOptions,
  StateProjection,
} from './types/index.js';

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  async findMany<S extends State, P extends StateProjection<S>>(
    options: FindManyOptions<S, P>,
  ): Promise<EntityList<Entity<S, P>>> {
    return createEntityList([], null);
  }

  async findUnique<S extends State, P extends StateProjection<S>>(
    options: FindUniqueOptions<S, P>,
  ): Promise<Entity<S, P> | undefined> {
    return undefined;
  }

  async findUniqueOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindUniqueOptions<S, P>,
  ): Promise<Entity<S, P>> {
    throw new Error('Not implemented');
  }

  async findFirst<S extends State, P extends StateProjection<S>>(
    options: FindFirstOptions<S, P>,
  ): Promise<Entity<S, P> | undefined> {
    return undefined;
  }

  async findFirstOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindFirstOptions<S, P>,
  ): Promise<Entity<S, P>> {
    throw new Error('Not implemented');
  }

  async mutateUnique<S extends State, A extends keyof S>(
    options: MutateUniqueOptions<S, A>,
  ): Promise<void>;
  async mutateUnique<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateUniqueProjectOptions<S, A, P>,
  ): Promise<Entity<MutationState<S, A>, P> | undefined>;
  async mutateUnique<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateUniqueOptions<S, A> | MutateUniqueProjectOptions<S, A, P>,
  ): Promise<Entity<MutationState<S, A>, P> | undefined | void> {
    throw new Error('Not implemented');
  }

  async mutateOne<S extends State, A extends keyof S>(
    options: MutateOneOptions<S, A>,
  ): Promise<void>;
  async mutateOne<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateOneProjectOptions<S, A, P>,
  ): Promise<Entity<MutationState<S, A>, P> | undefined>;
  async mutateOne<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateOneOptions<S, A> | MutateOneProjectOptions<S, A, P>,
  ): Promise<Entity<MutationState<S, A>, P> | undefined | void> {
    throw new Error('Not implemented');
  }

  async mutateMany<S extends State, A extends keyof S>(
    options: MutateManyOptions<S, A>,
  ): Promise<void>;
  async mutateMany<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateManyProjectOptions<S, A, P>,
  ): Promise<EntityList<Entity<MutationState<S, A>, P>>>;
  async mutateMany<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateManyOptions<S, A> | MutateManyProjectOptions<S, A, P>,
  ): Promise<EntityList<Entity<MutationState<S, A>, P>> | void> {
    throw new Error('Not implemented');
  }
}
