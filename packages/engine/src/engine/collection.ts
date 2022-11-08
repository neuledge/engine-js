import { State } from '@/generated/index.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';

export const chooseStatesCollection = <S extends State>(
  metadata: Metadata,
  states: S[],
): MetadataCollection => {
  const collections = metadata.getCollections(states);

  if (collections.length !== 1) {
    throw new Error('FindMany can only be used with one collection');
  }

  return collections[0];
};
