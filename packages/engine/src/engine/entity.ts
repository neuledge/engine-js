import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { EntityList } from '@/list';
import { ENTITY_METADATA_HASH_FIELD } from '@/metadata/constants';
import { Metadata } from '@/metadata/metadata';
import { StoreDocument, StoreList } from '@/store';

export const toEntityList = <S extends StateDefinition>(
  metadata: Metadata,
  list: StoreList,
): EntityList<Entity<S>> =>
  Object.assign(
    list
      .filter((document) =>
        Buffer.isBuffer(document[ENTITY_METADATA_HASH_FIELD]),
      )
      .map((document) =>
        getStateEntity<S>(
          metadata,
          document[ENTITY_METADATA_HASH_FIELD] as Buffer,
          document,
        ),
      ),
    { nextOffset: list.nextOffset },
  );

export const toMaybeEntity = <S extends StateDefinition>(
  metadata: Metadata,
  list: StoreList,
): Entity<S> | undefined => {
  const document = list[0];
  return document && Buffer.isBuffer(document[ENTITY_METADATA_HASH_FIELD])
    ? getStateEntity<S>(
        metadata,
        document[ENTITY_METADATA_HASH_FIELD],
        document,
      )
    : undefined;
};

export const toEntityOrThrow = <S extends StateDefinition>(
  metadata: Metadata,
  list: StoreList,
): Entity<S> => {
  const document = list[0];
  if (!document || !Buffer.isBuffer(document[ENTITY_METADATA_HASH_FIELD])) {
    throw new Error('Document not found');
  }

  return getStateEntity<S>(
    metadata,
    document[ENTITY_METADATA_HASH_FIELD],
    document,
  );
};

const getStateEntity = <S extends StateDefinition>(
  metadata: Metadata,
  stateHash: Buffer,
  document: StoreDocument,
  prefix = '',
): Entity<S> => {
  const state = metadata.findStateByHash(stateHash);
  if (!state) {
    throw new Error(`Entity state not found: ${stateHash.toString('base64')}`);
  }

  const entity = {
    $state: state.name,
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

    const stateHash = document[`${key}_${ENTITY_METADATA_HASH_FIELD}`] as
      | Buffer
      | undefined;

    if (!stateHash) continue;

    const childEntity = getStateEntity(
      metadata,
      stateHash,
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
