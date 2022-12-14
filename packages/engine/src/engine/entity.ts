import { Entity, ProjectedEntity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { Metadata } from '@/metadata/metadata';
import { StoreDocument, StoreList } from '@/store';
import { Select } from '@/queries';
import { MetadataCollection } from '@/metadata';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';

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

export const toMaybeEntity = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  document: StoreDocument | undefined,
): Entity<S> | undefined => {
  const stateHash = document?.[collection.reservedNames.hash];

  return Buffer.isBuffer(stateHash)
    ? getStateEntity<S>(
        metadata,
        collection,
        stateHash,
        document as StoreDocument,
      )
    : undefined;
};

export const toEntityOrThrow = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  document: StoreDocument | undefined,
): Entity<S> => {
  const stateHash = document?.[collection.reservedNames.hash];

  if (!Buffer.isBuffer(stateHash)) {
    throw new NeuledgeError(
      NeuledgeErrorCode.DOCUMENT_NOT_FOUND,
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
  prefix = '',
): Entity<S> => {
  const state = metadata.findStateByHash(stateHash);
  if (!state) {
    throw new NeuledgeError(
      NeuledgeErrorCode.ENTITY_STATE_NOT_FOUND,
      `Entity state not found: ${stateHash.toString('base64')}`,
    );
  }

  const entity = {
    $state: state.name,
    $version: document[collection.reservedNames.version] ?? 0,
  } as Entity<S>;

  for (const field of state.fields) {
    const key = `${prefix}${field.name}`;
    if (!(key in document) || !field.path) continue;

    const rawValue = document[key];
    const value = field.type.decode ? field.type.decode(rawValue) : rawValue;

    setEntityValue(entity, field.path, value);
  }

  for (const relation of state.relations) {
    const key = `${prefix}${relation.name}`;
    if (!relation.path) continue;

    const childStateHash = document[`${key}_${collection.reservedNames.hash}`];
    if (!Buffer.isBuffer(childStateHash)) continue;

    const childEntity = getStateEntity(
      metadata,
      collection,
      childStateHash,
      document,
      `${key}_`,
    );

    setEntityValue(entity, relation.path, childEntity);
  }

  return entity;
};

const setEntityValue = (obj: object, path: string, value: unknown): void => {
  const pathKeys = path.split('.');

  for (let i = 0; i < pathKeys.length - 1; i += 1) {
    const key = pathKeys[i];

    obj = !(key in obj)
      ? (obj[key as never] = {} as never)
      : (obj[key as never] as object);
  }

  obj[pathKeys[pathKeys.length - 1] as never] = value as never;
};

export const projectEntities = <S extends StateDefinition, P extends Select<S>>(
  entities: EntityList<Entity<S>>,
  select: P | true,
): EntityList<ProjectedEntity<S, P>> | EntityList<Entity<S>> => {
  if (select === true) {
    return entities;
  }

  return Object.assign(
    entities.map((entity) => projectEntitySelection(entity, select)),
    { nextOffset: entities.nextOffset },
  );
};

export const projectEntity = <S extends StateDefinition, P extends Select<S>>(
  entity: Entity<S>,
  select: P | true,
): ProjectedEntity<S, P> | Entity<S> => {
  if (select === true) {
    return entity;
  }

  return projectEntitySelection(entity, select);
};

const projectEntitySelection = <S extends StateDefinition, P extends Select<S>>(
  entity: Entity<S>,
  select: P,
): ProjectedEntity<S, P> => {
  const projectedEntity = {} as ProjectedEntity<S, P>;

  for (const [key, value] of Object.entries(select)) {
    if (!value) continue;

    projectedEntity[key as never] = entity[key] as never;
  }

  return projectedEntity;
};
