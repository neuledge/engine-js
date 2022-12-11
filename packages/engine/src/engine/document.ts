import { StateDefinition } from '@/definitions';
import { Entity } from '@/entity';
import { Metadata } from '@/metadata';
import { StoreDocument, StoreScalarValue } from '@/store';

export const toDocuments = <S extends StateDefinition>(
  metadata: Metadata,
  entities: Entity<S>[],
): StoreDocument[] => entities.map((entity) => toDocument(metadata, entity));

const toDocument = <S extends StateDefinition>(
  metadata: Metadata,
  entity: Entity<S>,
): StoreDocument => {
  const { $state } = entity as Entity<StateDefinition>;

  const state = metadata.findStateByKey($state);
  if (!state) {
    throw new Error(`State metadata not found: ${$state}`);
  }

  const document: StoreDocument = {};

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
