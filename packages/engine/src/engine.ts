import { EngineStore } from './store.js';
import {
  createEntityList,
  ProjectedEntity,
  EntityList,
  FindFirstProjectOptions,
  FindManyProjectOptions,
  FindUniqueProjectOptions,
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
  FindManyOptions,
  Entity,
  FindUniqueOptions,
  FindFirstOptions,
  MutateUniqueReturnOptions,
  MutateOneReturnOptions,
  MutateManyReturnOptions,
  CreateOneOptions,
  CreateOneVoidOptions,
  CreateOneProjectOptions,
  CreateManyOptions,
  CreateManyVoidOptions,
  CreateManyProjectOptions,
  CreationSelect,
} from './types/index.js';

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // finds

  async findMany<S extends State>(
    options: FindManyOptions<S>,
  ): Promise<EntityList<Entity<S>>>;
  async findMany<S extends State, P extends StateProjection<S>>(
    options: FindManyProjectOptions<S, P>,
  ): Promise<EntityList<ProjectedEntity<S, P>>>;
  async findMany<S extends State, P extends StateProjection<S>>(
    options: FindManyOptions<S> | FindManyProjectOptions<S, P>,
  ): Promise<EntityList<Entity<S>> | EntityList<ProjectedEntity<S, P>>> {
    return createEntityList([], null);
  }

  async findUnique<S extends State>(
    options: FindUniqueOptions<S>,
  ): Promise<Entity<S> | undefined>;
  async findUnique<S extends State, P extends StateProjection<S>>(
    options: FindUniqueProjectOptions<S, P>,
  ): Promise<ProjectedEntity<S, P> | undefined>;
  async findUnique<S extends State, P extends StateProjection<S>>(
    options: FindUniqueOptions<S> | FindUniqueProjectOptions<S, P>,
  ): Promise<Entity<S> | ProjectedEntity<S, P> | undefined> {
    return undefined;
  }

  async findUniqueOrThrow<S extends State>(
    options: FindUniqueOptions<S>,
  ): Promise<Entity<S>>;
  async findUniqueOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindUniqueProjectOptions<S, P>,
  ): Promise<ProjectedEntity<S, P>>;
  async findUniqueOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindUniqueOptions<S> | FindUniqueProjectOptions<S, P>,
  ): Promise<Entity<S> | ProjectedEntity<S, P>> {
    throw new Error('Not implemented');
  }

  async findFirst<S extends State>(
    options: FindFirstOptions<S>,
  ): Promise<Entity<S> | undefined>;
  async findFirst<S extends State, P extends StateProjection<S>>(
    options: FindFirstProjectOptions<S, P>,
  ): Promise<ProjectedEntity<S, P> | undefined>;
  async findFirst<S extends State, P extends StateProjection<S>>(
    options: FindFirstOptions<S> | FindFirstProjectOptions<S, P>,
  ): Promise<Entity<S> | ProjectedEntity<S, P> | undefined> {
    return undefined;
  }

  async findFirstOrThrow<S extends State>(
    options: FindFirstOptions<S>,
  ): Promise<Entity<S>>;
  async findFirstOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindFirstProjectOptions<S, P>,
  ): Promise<ProjectedEntity<S, P>>;
  async findFirstOrThrow<S extends State, P extends StateProjection<S>>(
    options: FindFirstOptions<S> | FindFirstProjectOptions<S, P>,
  ): Promise<Entity<S> | ProjectedEntity<S, P>> {
    throw new Error('Not implemented');
  }

  // create

  async createOne<S extends State, A extends keyof S>(
    options: CreateOneOptions<S, A>,
  ): Promise<Entity<S>>;
  async createOne<
    S extends State,
    A extends keyof S,
    P extends CreationSelect<S>,
  >(options: CreateOneProjectOptions<S, A, P>): Promise<ProjectedEntity<S, P>>;
  async createOne<S extends State, A extends keyof S>(
    options: CreateOneVoidOptions<S, A>,
  ): Promise<void>;
  async createOne<
    S extends State,
    A extends keyof S,
    P extends CreationSelect<S>,
  >(
    options:
      | CreateOneOptions<S, A>
      | CreateOneProjectOptions<S, A, P>
      | CreateOneVoidOptions<S, A>,
  ): Promise<Entity<S> | ProjectedEntity<S, P> | void> {
    throw new Error('Not implemented');
  }

  async createMany<S extends State, A extends keyof S>(
    options: CreateManyOptions<S, A>,
  ): Promise<Entity<S>[]>;
  async createMany<
    S extends State,
    A extends keyof S,
    P extends CreationSelect<S>,
  >(
    options: CreateManyProjectOptions<S, A, P>,
  ): Promise<ProjectedEntity<S, P>[]>;
  async createMany<S extends State, A extends keyof S>(
    options: CreateManyVoidOptions<S, A>,
  ): Promise<void>;
  async createMany<
    S extends State,
    A extends keyof S,
    P extends CreationSelect<S>,
  >(
    options:
      | CreateManyOptions<S, A>
      | CreateManyProjectOptions<S, A, P>
      | CreateManyVoidOptions<S, A>,
  ): Promise<Entity<S>[] | ProjectedEntity<S, P>[] | void> {
    throw new Error('Not implemented');
  }

  // mutate

  async mutateUnique<S extends State, A extends keyof S>(
    options: MutateUniqueOptions<S, A>,
  ): Promise<void>;
  async mutateUnique<S extends State, A extends keyof S>(
    options: MutateUniqueReturnOptions<S, A>,
  ): Promise<Entity<MutationState<S, A>> | undefined>;
  async mutateUnique<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateUniqueProjectOptions<S, A, P>,
  ): Promise<ProjectedEntity<MutationState<S, A>, P> | undefined>;
  async mutateUnique<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options:
      | MutateUniqueOptions<S, A>
      | MutateUniqueReturnOptions<S, A>
      | MutateUniqueProjectOptions<S, A, P>,
  ): Promise<
    | Entity<MutationState<S, A>>
    | ProjectedEntity<MutationState<S, A>, P>
    | undefined
    | void
  > {
    throw new Error('Not implemented');
  }

  async mutateUniqueOrThrow<S extends State, A extends keyof S>(
    options: MutateUniqueOptions<S, A>,
  ): Promise<void>;
  async mutateUniqueOrThrow<S extends State, A extends keyof S>(
    options: MutateUniqueReturnOptions<S, A>,
  ): Promise<Entity<MutationState<S, A>>>;
  async mutateUniqueOrThrow<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateUniqueProjectOptions<S, A, P>,
  ): Promise<ProjectedEntity<MutationState<S, A>, P>>;
  async mutateUniqueOrThrow<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options:
      | MutateUniqueOptions<S, A>
      | MutateUniqueReturnOptions<S, A>
      | MutateUniqueProjectOptions<S, A, P>,
  ): Promise<
    Entity<MutationState<S, A>> | ProjectedEntity<MutationState<S, A>, P> | void
  > {
    throw new Error('Not implemented');
  }

  async mutateOne<S extends State, A extends keyof S>(
    options: MutateOneOptions<S, A>,
  ): Promise<void>;
  async mutateOne<S extends State, A extends keyof S>(
    options: MutateOneReturnOptions<S, A>,
  ): Promise<Entity<MutationState<S, A>> | undefined>;
  async mutateOne<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateOneProjectOptions<S, A, P>,
  ): Promise<ProjectedEntity<MutationState<S, A>, P> | undefined>;
  async mutateOne<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options:
      | MutateOneOptions<S, A>
      | MutateOneReturnOptions<S, A>
      | MutateOneProjectOptions<S, A, P>,
  ): Promise<
    | Entity<MutationState<S, A>>
    | ProjectedEntity<MutationState<S, A>, P>
    | undefined
    | void
  > {
    throw new Error('Not implemented');
  }

  async mutateMany<S extends State, A extends keyof S>(
    options: MutateManyOptions<S, A>,
  ): Promise<void>;
  async mutateMany<S extends State, A extends keyof S>(
    options: MutateManyReturnOptions<S, A>,
  ): Promise<EntityList<Entity<MutationState<S, A>>>>;
  async mutateMany<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options: MutateManyProjectOptions<S, A, P>,
  ): Promise<EntityList<ProjectedEntity<MutationState<S, A>, P>>>;
  async mutateMany<
    S extends State,
    A extends keyof S,
    P extends MutationSelect<S, A>,
  >(
    options:
      | MutateManyOptions<S, A>
      | MutateManyReturnOptions<S, A>
      | MutateManyProjectOptions<S, A, P>,
  ): Promise<
    | EntityList<Entity<MutationState<S, A>>>
    | EntityList<ProjectedEntity<MutationState<S, A>, P>>
    | void
  > {
    throw new Error('Not implemented');
  }
}
