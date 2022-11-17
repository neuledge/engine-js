import { MetadataOriginState } from '../state.js';
import { getCollectionNames } from './collections.js';
import { assignFieldNames } from './fields.js';

export const assignMetadataNames = (
  metadataStates: MetadataOriginState[],
): MetadataOriginState[] => {
  const stateNames = getCollectionNames(
    metadataStates.map((item) => item.origin),
  );

  for (const state of metadataStates) {
    state.collectionName = stateNames.get(state.name) ?? state.name;
    state.fields = assignFieldNames(state.fields);
  }

  return metadataStates;
};
