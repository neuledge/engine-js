import { resolveDefer, StateDefinition } from '@/definitions/index.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';

export const chooseStatesCollection = <S extends StateDefinition>(
  metadata: Metadata,
  states: S[],
): MetadataCollection => {
  const collections = metadata.getCollections(states);

  if (collections.length !== 1) {
    throw new Error('FindMany can only be used with one collection');
  }

  return collections[0];
};

export const getCollectionRelationStates = (
  collection: MetadataCollection,
  key: string,
): StateDefinition[] => [
  ...new Map(
    collection.states
      .flatMap((s): StateDefinition[] => {
        const relations = resolveDefer(s.origin.$relations, {})[key];
        if (!relations) {
          return [];
        }

        return Array.isArray(relations[0])
          ? (relations[0] as StateDefinition[])
          : (relations as StateDefinition[]);
      })
      .map((s) => [s.$name, s]),
  ).values(),
];
