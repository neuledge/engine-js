import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { Metadata } from '@/metadata/metadata';
import { StoreDocument, StoreList } from '@neuledge/store';

import { MetadataCollection } from '@/metadata';
import { NeuledgeError } from '@/error';

export const toEntityList = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  list: StoreList,
): EntityList<Entity<S>> =>
  Object.assign(
    list
      .map((document) => {
        const stateHash = document[collection.reservedNames.hash];

        return Buffer.isBuffer(stateHash)
          ? getStateEntity<S>(metadata, collection, stateHash, document)
          : undefined;
      })
      .filter((entity): entity is Entity<S> => entity !== undefined),
    { nextOffset: list.nextOffset },
  );

export const toEntityListOrThrow = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  list: StoreList,
): EntityList<Entity<S>> => {
  const entities = toEntityList(metadata, collection, list);

  if (!entities.length) {
    throw new NeuledgeError(
      NeuledgeError.Code.DOCUMENT_NOT_FOUND,
      'Document not found',
    );
  }

  return entities;
};

export const toMaybeEntity = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  document: StoreDocument | undefined,
): Entity<S> | null => {
  const stateHash = document?.[collection.reservedNames.hash];

  return Buffer.isBuffer(stateHash)
    ? getStateEntity<S>(
        metadata,
        collection,
        stateHash,
        document as StoreDocument,
      )
    : null;
};

export const toEntityOrThrow = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  document: StoreDocument | undefined,
): Entity<S> => {
  const stateHash = document?.[collection.reservedNames.hash];

  if (!Buffer.isBuffer(stateHash)) {
    throw new NeuledgeError(
      NeuledgeError.Code.DOCUMENT_NOT_FOUND,
      'Document not found',
    );
  }

  return getStateEntity<S>(
    metadata,
    collection,
    stateHash,
    document as StoreDocument,
  );
};

const getStateEntity = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  stateHash: Buffer,
  document: StoreDocument,
): Entity<S> => {
  const state = metadata.findStateByHash(stateHash);
  if (!state) {
    throw new NeuledgeError(
      NeuledgeError.Code.ENTITY_STATE_NOT_FOUND,
      `Entity state not found: ${stateHash.toString('base64')}`,
    );
  }

  const entity = {
    $state: state.name,
    $version: document[collection.reservedNames.version] ?? 0,
  } as Entity<S>;

  for (const field of state.fields) {
    if (!(field.name in document) || !field.path) continue;

    const rawValue = document[field.name];
    const value = field.type.decode ? field.type.decode(rawValue) : rawValue;

    setEntityValue(entity, field.path, value);
  }

  for (const relation of state.relations) {
    if (!relation.path) continue;

    const childDocument = document[relation.name] as StoreDocument | undefined;
    if (childDocument == null) continue;

    const childStateHash = childDocument[collection.reservedNames.hash];
    if (!Buffer.isBuffer(childStateHash)) continue;

    const childEntity = getStateEntity(
      metadata,
      collection,
      childStateHash,
      childDocument,
    );

    setEntityValue(entity, relation.path, childEntity);
  }

  return entity;
};

const setEntityValue = (obj: object, path: string, value: unknown): void => {
  const pathKeys = path.split('.');

  for (let i = 0; i < pathKeys.length - 1; i += 1) {
    const key = pathKeys[i];

    obj =
      key in obj
        ? (obj[key as never] as object)
        : (obj[key as never] = {} as never);
  }

  obj[pathKeys.at(-1) as never] = value as never;
};
