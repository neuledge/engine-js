import { StateDefinition } from '@/definitions';
import { MetadataCollection } from './collection';
import {
  renameDuplicateFieldNames,
  groupStatesByCollectionName,
} from './names';
import { MetadataState, MetadataStateContext } from './state';
import { MetadataSnapshot } from './snapshot';
import { NeuledgeError } from '@/error';
import { MetadataChange } from './change';

/**
 * Metadata is a snapshot of the current state of the database, including all
 * the states, fields, and types instances that are currently used in the
 * codebase.
 */
export class Metadata extends MetadataSnapshot<MetadataState> {
  private collections: Partial<Record<string, MetadataCollection>>;

  constructor(states: Iterable<StateDefinition>) {
    const stateGroups = groupStatesByCollectionName(states);

    const ctx: MetadataStateContext = {};
    const collections: Partial<Record<string, MetadataCollection>> = {};

    const allStates: MetadataState[] = [];

    for (const [name, states] of stateGroups) {
      const metadataStates = [...states].map((state) =>
        MetadataState.fromDefinition(ctx, state, name),
      );

      renameDuplicateFieldNames(metadataStates);

      collections[name] = new MetadataCollection(name, metadataStates);
      allStates.push(...metadataStates);
    }

    super(allStates);

    this.collections = collections;
  }

  get listCollections(): MetadataCollection[] {
    return Object.values(this.collections) as MetadataCollection[];
  }

  getCollectionByMetadataState(state: MetadataState): MetadataCollection {
    const collection = this.collections[state.collectionName];

    if (!collection) {
      throw new NeuledgeError(
        NeuledgeError.Code.METADATA_LOAD_ERROR,
        `Collection "${state.collectionName}" not found in the engine metadata. Make sure you initialize the engine AFTER declaring the states.`,
      );
    }

    return collection;
  }

  getCollections(states: readonly StateDefinition[]): MetadataCollection[] {
    const collectionNames = new Set<MetadataState['collectionName']>();

    for (const def of states) {
      const state = this.findStateByKey(def.$name);
      if (!state) {
        throw new NeuledgeError(
          NeuledgeError.Code.METADATA_LOAD_ERROR,
          `State "${def.$name}" not found in the engine metadata. Make sure you initialize the engine AFTER declaring the states.`,
        );
      }

      collectionNames.add(state.collectionName);
    }

    return [...collectionNames].map((name) => {
      const collection = this.collections[name];

      if (!collection) {
        throw new NeuledgeError(
          NeuledgeError.Code.METADATA_LOAD_ERROR,
          `Collection "${name}" not found in the engine metadata. Make sure you initialize the engine AFTER declaring the states.`,
        );
      }

      return collection;
    });
  }

  sync(snapshot: MetadataSnapshot): MetadataChange[] {
    const changes = super.sync(snapshot);

    // recreate collections as some state names may have changed

    const collectionStates: Record<string, MetadataState[]> = {};
    for (const state of this.states) {
      let entry = collectionStates[state.collectionName];

      if (!entry) {
        entry = collectionStates[state.collectionName] = [];
      }

      entry.push(state);
    }

    const collections: Record<string, MetadataCollection> = {};
    for (const [name, states] of Object.entries(collectionStates)) {
      collections[name] = new MetadataCollection(name, states);
    }

    this.collections = collections;
    return changes;
  }
}
