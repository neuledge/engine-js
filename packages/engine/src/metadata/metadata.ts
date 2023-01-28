import { StateDefinition } from '@/definitions';
import { MetadataCollection } from './collection';
import {
  renameDuplicateFieldNames,
  groupStatesByCollectionName,
} from './names';
import { MetadataState, MetadataStateContext } from './state';
import { MetadataSnapshot } from './snapshot';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';

/**
 * Metadata is a snapshot of the current state of the database, including all
 * the states, fields, and types instances that are currently used in the
 * codebase.
 */
export class Metadata extends MetadataSnapshot<MetadataState> {
  private readonly collections: Partial<Record<string, MetadataCollection>>;

  constructor(states: Iterable<StateDefinition>) {
    const stateGroups = groupStatesByCollectionName(states);

    const ctx: MetadataStateContext = {};
    const collections: Partial<Record<string, MetadataCollection>> = {};

    const allStates: MetadataState[] = [];

    for (const [name, states] of stateGroups) {
      const metadataStates = [...states].map((state) =>
        MetadataState.fromDefinition(ctx, state, name),
      );

      // FIXME how we handle index field name rename?
      renameDuplicateFieldNames(metadataStates);

      collections[name] = new MetadataCollection(name, metadataStates);
      allStates.push(...metadataStates);
    }

    super(allStates);

    this.collections = collections;
  }

  getCollections(states: StateDefinition[]): MetadataCollection[] {
    const collectionNames = new Set<MetadataState['collectionName']>();

    for (const def of states) {
      const state = this.findStateByKey(def.$name);
      if (!state) {
        throw new NeuledgeError(
          NeuledgeErrorCode.METADATA_LOAD_ERROR,
          `State "${def.$name}" not found in the engine metadata. Make sure you initialize the engine AFTER declaring the states.`,
        );
      }

      collectionNames.add(state.collectionName);
    }

    return [...collectionNames].map((name) => {
      const collection = this.collections[name];

      if (!collection) {
        throw new NeuledgeError(
          NeuledgeErrorCode.METADATA_LOAD_ERROR,
          `Collection "${name}" not found in the engine metadata. Make sure you initialize the engine AFTER declaring the states.`,
        );
      }

      return collection;
    });
  }
}
