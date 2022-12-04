import { MetadataState } from '../state';
import { getCollectionNames } from './collections';
import { assignFieldNames } from './fields';

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
