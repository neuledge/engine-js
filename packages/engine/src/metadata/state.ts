import { resolveDefer, State } from '@/generated/index.js';
import { Scalar } from '@neuledge/scalars';
import { StateCollectionNames } from './collections.js';
import { generateHash } from './hash.js';

export type MetadataStateHash = Buffer;

export interface MetadataState {
  collectionName: string;
  key: string;
  hash: MetadataStateHash;
  fields: Record<string, MetadataStateField>;
  origin?: State;
}

export interface MetadataStateField {
  fieldName: string;
  type: Scalar['key'] | MetadataState[];
  index: number;
  nullable: boolean;
}

export const toMetadataState = (
  names: StateCollectionNames,
  state: State,
): MetadataState => {
  const collectionName = names[state.$key];
  if (!collectionName) {
    throw new ReferenceError(
      `Can't find unique collection name for state '${state.$key}'`,
    );
  }

  const fields: MetadataState['fields'] = {};

  const scalars = resolveDefer(state.$scalars);
  for (const key in scalars) {
    const { type, index, nullable } = scalars[key];

    const fieldName = names[`${state.$key}.${key}`];
    if (!fieldName) {
      throw new ReferenceError(
        `Can't find unique field name for '${state.$key}.${key}'`,
      );
    }

    fields[key] = {
      fieldName,
      type: Array.isArray(type)
        ? type.map((item) => toMetadataState(names, item))
        : type.key,
      index,
      nullable: !!nullable,
    };
  }

  return {
    collectionName: names[state.$key],
    key: state.$key,
    hash: generateStateHash(fields),
    fields,
    origin: state,
  };
};

export const isMetadataStatesEquals = (
  a: MetadataState,
  b: MetadataState,
): boolean =>
  a.key === b.key &&
  a.hash.equals(b.hash) &&
  Object.entries(a.fields).every(([key, { type, index, nullable }]) => {
    const bf = b.fields[key];
    if (!bf) return false;

    const bt = bf.type;

    return (
      index === bf.index &&
      nullable === bf.nullable &&
      (typeof type === 'string'
        ? type === bt
        : type.length === bt.length &&
          typeof bt !== 'string' &&
          type.every((item, i) => isMetadataStatesEquals(item, bt[i])))
    );
  });

export const isStatesMatches = (
  actual: MetadataState,
  target: MetadataState,
): boolean =>
  actual === target ||
  Object.entries(target.fields).every(([key, { type, nullable }]) => {
    const actualField = actual.fields[key];
    if (!actualField) {
      return nullable;
    }

    if (actualField.nullable && !nullable) {
      return false;
    }

    const actualType = actualField.type;

    if (!Array.isArray(type) || !Array.isArray(actualType)) {
      return type === actualType;
    }

    return actualType.every((actualState) =>
      type.some((typeState) => isStatesMatches(actualState, typeState)),
    );
  });

export const serializeMetadataState = (
  state: MetadataState,
): MetadataState => ({
  collectionName: state.collectionName,
  key: state.key,
  hash: state.hash,
  fields: Object.fromEntries(
    Object.entries(state.fields).map(
      ([key, { fieldName, type, index, nullable }]): [
        string,
        MetadataStateField,
      ] => [
        key,
        {
          fieldName,
          type:
            typeof type === 'string'
              ? type
              : type.map((item) => serializeMetadataState(item)),
          index,
          nullable,
        },
      ],
    ),
  ),
});

const generateStateHash = (
  fields: MetadataState['fields'],
): MetadataStateHash =>
  generateHash(
    Object.values(fields)
      .map(
        ({ type, index, nullable }): [number, string | string[], boolean] => [
          index,
          Array.isArray(type)
            ? type.map((item) => item.hash.toString('hex'))
            : type,
          nullable,
        ],
      )
      .sort((a, b) => a[0] - b[0]),
  );
