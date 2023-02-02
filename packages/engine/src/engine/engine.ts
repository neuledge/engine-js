import { Metadata } from '@/metadata/metadata';
import { StateDefinition } from '../definitions';
import {
  FindFirstOrThrowQuery,
  FindFirstQuery,
  FindManyQuery,
  FindUniqueOrThrowQuery,
  FindUniqueQuery,
  QueryClass,
} from '../queries';
import { Store } from '@neuledge/store';
import { loadMetadata } from './metadata';
import {
  execAlterMany,
  execAlterOne,
  execFindFirst,
  execFindFirstOrThrow,
  execFindMany,
  execFindUnique,
  execFindUniqueOrThrow,
  execInitMany,
  execInitOne,
} from './exec';
import {
  AlterFirstMutation,
  AlterFirstOrThrowMutation,
  AlterManyMutation,
  AlterUniqueMutation,
  AlterUniqueOrThrowMutation,
  InitManyMutation,
  InitOneMutation,
  MutationGenerator,
} from '@/mutations';
import { NeuledgeError } from '@/error';

export interface NeuledgeEngineOptions {
  store: Store;
  metadataCollectionName?: string;
}

/**
 * The main class of the Neuledge engine.
 * It provides methods to query and mutate state entities. To create an instance
 * of this class, you will need to provide a store instance. The store is used
 * to persist the state entities on the database.
 *
 * ```ts
 * import { NeuledgeEngine } from '@neuledge/engine';
 * import { MongoDBStore } from '@neuledge/mongodb-store';
 *
 * const store = new MongoDBStore({ ... });
 * const engine = new NeuledgeEngine({ store });
 */
export class NeuledgeEngine {
  public readonly store: Store;
  public readonly metadata: Promise<Metadata>;

  constructor(options: NeuledgeEngineOptions) {
    this.store = options.store;

    this.metadata = loadMetadata(
      this.store,
      options.metadataCollectionName,
    ).catch(NeuledgeError.wrap());

    this.metadata.catch(() => {
      // ignore errors here and let the user handle them via the exec methods
    });
  }

  // finds

  /**
   * Find many entities that match the given states.
   * It's not possible to query multiple states from different collections at
   * once.
   */
  findMany<S extends StateDefinition>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({
      type: 'FindMany',
      states,
      exec: (options) => execFindMany(this, options),
    });
  }

  /**
   * Find a unique entity that matches the given states.
   * Use the `.unique()` method to provide the unique where clause. Returns null
   * if no entity was found. It's not possible to query multiple states from
   * different collections at once.
   */
  findUnique<S extends StateDefinition>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: (options) => execFindUnique(this, options),
    });
  }

  /**
   * Find a unique entity that matches the given states.
   * Use the `.unique()` method to provide the unique where clause. Throws an
   * error if no entity was found. It's not possible to query multiple states
   * from different collections at once.
   */
  findUniqueOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindUniqueOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindUniqueOrThrow',
      states,
      unique: true,
      exec: (options) => execFindUniqueOrThrow(this, options),
    });
  }

  /**
   * Find the first entity that matches the given states.
   * Returns null if no entity was found. It's not possible to query multiple
   * states from different collections at once.
   */
  findFirst<S extends StateDefinition>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({
      type: 'FindFirst',
      states,
      exec: (options) => execFindFirst(this, options),
    });
  }

  /**
   * Find the first entity that matches the given states.
   * Throws an error if no entity was found. It's not possible to query multiple
   * states from different collections at once.
   */
  findFirstOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): FindFirstOrThrowQuery<S> {
    return new QueryClass({
      type: 'FindFirstOrThrow',
      states,
      exec: (options) => execFindFirstOrThrow(this, options),
    });
  }

  // init

  /**
   * Call a create mutation for the given state and create multiple new
   * entities.
   * Returns void by default. Use the `.select()` method to return the created
   * entities.
   *
   * For example, for a state `DraftPost` with the create mutation `create`:
   * ```
   * engine.initMany(DraftPost).create({ title: 'Hello' }, { title: 'World' })
   * ```
   */
  initMany<S extends StateDefinition>(state: S): InitManyMutation<S> {
    return MutationGenerator(
      'InitMany',
      [state],
      (options) =>
        new QueryClass<'InitMany', S, S>({
          ...options,
          exec: (options) => execInitMany(this, options),
        }),
    );
  }

  /**
   * Call a create mutation for the given state and create a new entity.
   * Returns void by default. Use the `.select()` method to return the created
   * entity.
   *
   * For example, for a state `DraftPost` with the create mutation `create`:
   * ```
   * engine.initOne(DraftPost).create({ title: 'Hello' })
   * ```
   */
  initOne<S extends StateDefinition>(state: S): InitOneMutation<S> {
    return MutationGenerator(
      'InitOne',
      [state],
      (options) =>
        new QueryClass<'InitOne', S, S>({
          ...options,
          exec: (options) => execInitOne(this, options),
        }),
    );
  }

  // alter

  /**
   * Call an update or delete mutation for the given states and alter multiple
   * entities at once.
   * Returns void by default. Use the `.select()` method to return the altered
   * entities. You may filter and limit the entities that are altered by using
   * `.where()` or other methods.
   *
   * For example, for a state `DraftPost` with the update mutation `update`:
   * ```
   * engine.alterMany(DraftPost).update({ title: 'Hello' })
   * ```
   */
  alterMany<S extends StateDefinition>(...states: S[]): AlterManyMutation<S> {
    return MutationGenerator(
      'AlterMany',
      states,
      (options) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new QueryClass<'AlterMany', S, any>({
          ...options,
          exec: (options) => execAlterMany(this, options),
        }),
    );
  }

  /**
   * Call an update or delete mutation for the given states and alter the first
   * matching entity.
   * Returns void by default. Use the `.select()` method to return the altered
   * entity. You may filter and limit the entities that are altered by using
   * `.where()` or other methods.
   *
   * For example, for a state `DraftPost` with the update mutation `update`:
   * ```
   * engine.alterFirst(DraftPost).update({ title: 'Hello' })
   * ```
   */
  alterFirst<S extends StateDefinition>(...states: S[]): AlterFirstMutation<S> {
    return MutationGenerator(
      'AlterFirst',
      states,
      (options) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new QueryClass<'AlterFirst', S, any>({
          ...options,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  /**
   * Call an update or delete mutation for the given states and alter the first
   * matching entity.
   * Returns void by default. Use the `.select()` method to return the altered
   * entity. Throws an error if no entity was found. You may filter and limit
   * the entities that are altered by using `.where()` or other methods.
   *
   * For example, for a state `DraftPost` with the update mutation `update`:
   * ```
   * engine.alterFirstOrThrow(DraftPost).update({ title: 'Hello' })
   * ```
   */
  alterFirstOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): AlterFirstOrThrowMutation<S> {
    return MutationGenerator(
      'AlterFirstOrThrow',
      states,
      (options) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new QueryClass<'AlterFirstOrThrow', S, any>({
          ...options,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  /**
   * Call an update or delete mutation for the given states and alter the
   * uniquely matching entity.
   * Returns void by default. Use the `.select()` method to return the altered
   * entity. Use the `.unique()` method to specify the unique fields.
   *
   * For example, for a state `DraftPost` with the update mutation `update`:
   * ```
   * engine.alterUnique(DraftPost).update({ title: 'Hello' }).unique({ id: 1 })
   * ```
   */
  alterUnique<S extends StateDefinition>(
    ...states: S[]
  ): AlterUniqueMutation<S> {
    return MutationGenerator(
      'AlterUnique',
      states,
      (options) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new QueryClass<'AlterUnique', S, any>({
          ...options,
          unique: true,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  /**
   * Call an update or delete mutation for the given states and alter the
   * uniquely matching entity.
   * Returns void by default. Use the `.select()` method to return the altered
   * entity. Throws an error if no entity was found. Use the `.unique()` method
   * to specify the unique fields.
   *
   * For example, for a state `DraftPost` with the update mutation `update`:
   * ```
   * engine.alterUniqueOrThrow(DraftPost).update({ title: 'Hello' }).unique({ id: 1 })
   * ```
   */
  alterUniqueOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): AlterUniqueOrThrowMutation<S> {
    return MutationGenerator(
      'AlterUniqueOrThrow',
      states,
      (options) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new QueryClass<'AlterUniqueOrThrow', S, any>({
          ...options,
          unique: true,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  // utils

  /**
   * Return a promise that resolves when the engine is ready.
   * The engine is ready when the metadata is loaded and the database is
   * connected. This is useful when you want to wait for the engine to be ready
   * before starting your server. If you query the engine before it is ready,
   * the queries will be queued and executed when the engine is ready or throw
   * if there is an error while loading the engine.
   */
  async ready(): Promise<this> {
    await this.metadata;
    return this;
  }
}
