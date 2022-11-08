import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ENTITY_METADATA_HASH_FIELD } from '@/metadata/constants.js';
import { Metadata } from '@/metadata/metadata.js';
import { StoreDocument, StoreList } from '@/store/index.js';

export const toEntityList = <S extends State>(
  metadata: Metadata,
  list: StoreList,
): EntityList<Entity<S>> =>
  Object.assign(
    list.map((item) => toEntity<S>(metadata, item)),
    { nextOffset: list.nextOffset },
  );

export const toMaybeEntity = <S extends State>(
  metadata: Metadata,
  list: StoreList,
): Entity<S> | undefined => {
  const document = list[0];
  return document && toEntity<S>(metadata, document);
};

export const toEntityOrThrow = <S extends State>(
  metadata: Metadata,
  list: StoreList,
): Entity<S> => {
  const document = list[0];
  if (!document) {
    throw new Error('Document not found');
  }

  return toEntity<S>(metadata, document);
};

const toEntity = <S extends State>(
  metadata: Metadata,
  document: StoreDocument,
): Entity<S> => {
  const stateHash = document[ENTITY_METADATA_HASH_FIELD] as Buffer;

  const state = metadata.findStateByHash(stateHash);
  if (!state) {
    throw new Error(`Entity state not found: ${stateHash.toString('base64')}`);
  }

  const entity = {
    $state: state.key,
    constructor: state.origin,
  } as Entity<S>;

  for (const [key, field] of Object.entries(state.fields)) {
    if (!(field.fieldName in document)) continue;

    const rawValue = document[field.fieldName];
    const value = field.type.decode ? field.type.decode(rawValue) : rawValue;

    // FIXME populate relations

    entity[key] = (value as never) ?? null;
  }

  return entity;
};
