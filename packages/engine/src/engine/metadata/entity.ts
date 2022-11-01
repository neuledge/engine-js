import {
  MetadataEither,
  MetadataEntity,
  MetadataState,
  MetadataStateField,
} from '@/metadata/index.js';

export type StoreMetadataEntity = StoreMetadataState | StoreMetadataEither;

interface StoreMetadataState {
  type: 'state';
  key: string;
  hash: Buffer;
  fields: StoreMetadataStateField[];
}

interface StoreMetadataStateField {
  key: string;
  type: string | Buffer[];
  index: number;
  nullable: boolean;
}

interface StoreMetadataEither {
  type: 'either';
  key: string;
  hash: Buffer;
  states: Buffer[];
}

export const toMetadataEntity = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataEntity,
): MetadataEntity => {
  switch (doc.type) {
    case 'either': {
      return toMedatadataEither(getState, doc);
    }

    case 'state': {
      return toMedatadataState(getState, doc);
    }

    default: {
      // @ts-expect-error doc type is `never`
      throw new Error(`Unknown metadata entity type: ${doc.type}`);
    }
  }
};

const toMedatadataEither = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataEither,
): MetadataEither => {
  const states = doc.states.map((hash) => getState(hash) as MetadataState);

  return Object.assign(states, {
    key: doc.key,
    hash: doc.hash,
  });
};

const toMedatadataState = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataState,
): MetadataState =>
  Object.assign(getState(doc.hash), {
    key: doc.key,
    hash: doc.hash,
    fields: Object.fromEntries(
      Object.entries(doc.fields).map(([key, field]) => [
        key,
        toMedatadataStateField(getState, field),
      ]),
    ),
  });

const toMedatadataStateField = (
  getState: (hash: Buffer) => MetadataState,
  doc: StoreMetadataStateField,
): MetadataStateField => ({
  type: Array.isArray(doc.type)
    ? doc.type.map((item) => getState(item))
    : doc.type,
  index: doc.index,
  nullable: doc.nullable,
});

export const toStoreMetadataEntity = (
  entity: MetadataEntity,
): StoreMetadataEntity => {
  if (Array.isArray(entity)) {
    return toStoreMetadataEither(entity);
  }

  return toStoreMetadataState(entity);
};

const toStoreMetadataState = (state: MetadataState): StoreMetadataState => ({
  type: 'state',
  key: state.key,
  hash: state.hash,
  fields: Object.entries(state.fields).map(
    ([key, field]): StoreMetadataStateField => ({
      key,
      type:
        typeof field.type === 'string'
          ? field.type
          : field.type.map((item) => item.hash),
      index: field.index,
      nullable: field.nullable,
    }),
  ),
});

const toStoreMetadataEither = (
  either: MetadataEither,
): StoreMetadataEither => ({
  type: 'either',
  key: either.key,
  hash: either.hash,
  states: either.map((item) => item.hash),
});
