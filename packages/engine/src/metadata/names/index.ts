import { MetadataState } from '../state/index.js';
import { getCollectionNames } from './collections.js';
import { assignFieldNames } from './fields.js';

export const assignMetadataNames = (
  metadataStates: MetadataState[],
): MetadataState[] => {
  const stateNames = getCollectionNames(
    metadataStates.map((item) => item.instance),
  );

  for (const state of metadataStates) {
    state.collectionName = stateNames.get(state.name) ?? state.name;
    assignFieldNames(state.fields);
  }

  return metadataStates;
};
