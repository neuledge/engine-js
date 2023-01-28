import { StateDefinition } from '@/definitions';
import { Entity } from '@/entity';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { Metadata, MetadataCollection } from '@/metadata';
import { StoreDocument, StoreScalarValue } from '@neuledge/store';

export const toDocument = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  entity: Entity<S>,
): StoreDocument => {
  const { $state, $version } = entity as Entity<StateDefinition>;

  const state = metadata.findStateByKey($state);
  if (!state) {
    throw new NeuledgeError(
      NeuledgeErrorCode.ENTITY_STATE_NOT_FOUND,
      `State metadata not found: ${$state}`,
    );
  }

  const document: StoreDocument = {
    [collection.reservedNames.hash]: state.hash,
    [collection.reservedNames.version]: $version,
  };

  for (const field of state.fields) {
    document[field.name] = getEntityValue(entity, field.path);
  }

  return document;
};

const getEntityValue = (
  obj: object,
  path: string,
): StoreScalarValue | undefined => {
  const pathKeys = path.split('.');
  let value = obj as StoreScalarValue;

  for (const key of pathKeys) {
    if (typeof value !== 'object' || value === null) {
      return undefined;
    }

    value = (value as Record<string, StoreScalarValue>)[key];
  }

  return value;
};
