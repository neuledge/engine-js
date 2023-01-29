import { resolveDefer, StateDefinition } from '@/definitions';
import { NeuledgeError } from '@/error';
import { Metadata, MetadataCollection, MetadataState } from '@/metadata';

export const chooseStatesCollection = <S extends StateDefinition>(
  metadata: Metadata,
  states: S[],
): { collection: MetadataCollection; states: MetadataState[] } => {
  const collections = metadata.getCollections(states);

  if (collections.length !== 1) {
    if (!collections.length) {
      throw new NeuledgeError(
        NeuledgeError.Code.NO_COLLECTIONS,
        `No collections found for ${states.length} states`,
      );
    }

    throw new NeuledgeError(
      NeuledgeError.Code.MULTIPLE_COLLECTIONS,
      `Engine operations can only be used with one collection, got request for ${
        collections.length
      } collections: ${collections.map((c) => c.name).join(', ')}`,
    );
  }

  const collection = collections[0];

  const stateNames = new Set(states.map((s) => s.$name));
  const collectionStates = collection.states.filter((s) =>
    stateNames.has(s.name),
  );

  return { collection, states: collectionStates };
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
