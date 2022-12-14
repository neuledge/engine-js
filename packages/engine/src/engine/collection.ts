import { resolveDefer, StateDefinition } from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { Metadata, MetadataCollection } from '@/metadata';

export const chooseStatesCollection = <S extends StateDefinition>(
  metadata: Metadata,
  states: S[],
): MetadataCollection => {
  const collections = metadata.getCollections(states);

  if (collections.length !== 1) {
    throw new NeuledgeError(
      NeuledgeErrorCode.MULTIPLE_COLLECTIONS,
      `Engine operations can only be used with one collection, got request for ${
        collections.length
      } collections: ${collections.map((c) => c.name).join(', ')}`,
    );
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
        const relations = resolveDefer(s.instance.$relations, {})[key];
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
