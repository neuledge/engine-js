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

export interface NeuledgeEngineOptions {
  store: Store;
  metadataCollectionName?: string;
}

export class NeuledgeEngine {
  public readonly store: Store;
  public readonly metadata: Promise<Metadata>;

  constructor(options: NeuledgeEngineOptions) {
    this.store = options.store;

    this.metadata = loadMetadata(this.store, options.metadataCollectionName);

    this.metadata.catch(() => {
      // ignore errors here and let the user handle them via the exec methods
    });
  }

  // finds

  findMany<S extends StateDefinition>(...states: S[]): FindManyQuery<S> {
    return new QueryClass({
      type: 'FindMany',
      states,
      exec: (options) => execFindMany(this, options),
    });
  }

  findUnique<S extends StateDefinition>(...states: S[]): FindUniqueQuery<S> {
    return new QueryClass({
      type: 'FindUnique',
      states,
      unique: true,
      exec: (options) => execFindUnique(this, options),
    });
  }

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

  findFirst<S extends StateDefinition>(...states: S[]): FindFirstQuery<S> {
    return new QueryClass({
      type: 'FindFirst',
      states,
      exec: (options) => execFindFirst(this, options),
    });
  }

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

  alterMany<S extends StateDefinition>(...states: S[]): AlterManyMutation<S> {
    return MutationGenerator(
      'AlterMany',
      states,
      (options) =>
        new QueryClass<'AlterMany', S, never>({
          ...options,
          exec: (options) => execAlterMany(this, options),
        }),
    );
  }

  alterFirst<S extends StateDefinition>(...states: S[]): AlterFirstMutation<S> {
    return MutationGenerator(
      'AlterFirst',
      states,
      (options) =>
        new QueryClass<'AlterFirst', S, never>({
          ...options,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  alterFirstOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): AlterFirstOrThrowMutation<S> {
    return MutationGenerator(
      'AlterFirstOrThrow',
      states,
      (options) =>
        new QueryClass<'AlterFirstOrThrow', S, never>({
          ...options,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  alterUnique<S extends StateDefinition>(
    ...states: S[]
  ): AlterUniqueMutation<S> {
    return MutationGenerator(
      'AlterUnique',
      states,
      (options) =>
        new QueryClass<'AlterUnique', S, never>({
          ...options,
          unique: true,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  alterUniqueOrThrow<S extends StateDefinition>(
    ...states: S[]
  ): AlterUniqueOrThrowMutation<S> {
    return MutationGenerator(
      'AlterUniqueOrThrow',
      states,
      (options) =>
        new QueryClass<'AlterUniqueOrThrow', S, never>({
          ...options,
          unique: true,
          exec: (options) => execAlterOne(this, options),
        }),
    );
  }

  // utils

  async ready(): Promise<this> {
    await this.metadata;
    return this;
  }
}
