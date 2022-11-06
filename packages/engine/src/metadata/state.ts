import { resolveDefer, State } from '@/generated/index.js';
import { Scalar } from '@neuledge/scalars';
import { StateCollectionNames } from './names.js';
import { generateHash } from './hash.js';

export type MetadataStateHash = Buffer;

export interface MetadataState {
  collectionName: string;
  key: string;
  hash: MetadataStateHash;
  fields: Record<string, MetadataStateField>;
  origin?: State;
}

export interface MetadataLiveState extends MetadataState {
  origin: State;
}

export interface MetadataStateField {
  fieldName: string;
  type: Scalar['key'];
  index: number;
  nullable: boolean;
  relations: MetadataState[];
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
    const { type, index, nullable, relation } = scalars[key];

    const fieldName = names[`${state.$key}.${key}`];
    if (!fieldName) {
      throw new ReferenceError(
        `Can't find unique field name for '${state.$key}.${key}'`,
      );
    }

    fields[key] = {
      fieldName,
      type: type.key,
      index,
      nullable: !!nullable,
      relations: relation?.map((item) => toMetadataState(names, item)) ?? [],
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
    const other = b.fields[key];
    if (!other) return false;

    return (
      index === other.index &&
      nullable === other.nullable &&
      type === other.type
    );
  });

export const isStatesMatches = (
  actual: MetadataState,
  target: MetadataState,
): boolean => {
  if (actual === target) return true;

  const actualFields = new Map(
    Object.values(actual.fields).map((item) => [item.index, item]),
  );

  return Object.values(target.fields).every(({ index, type, nullable }) => {
    const actualField = actualFields.get(index);
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
};

export const serializeMetadataState = (
  refs: Record<string, MetadataState>,
  state: MetadataState,
): MetadataState =>
  refs[state.key] ??
  (refs[state.key] = {
    collectionName: state.collectionName,
    key: state.key,
    hash: state.hash,
    fields: Object.fromEntries(
      Object.entries(state.fields).map(
        ([key, { fieldName, type, index, nullable, relations }]): [
          string,
          MetadataStateField,
        ] => [
          key,
          {
            fieldName,
            type,
            index,
            nullable,
            relations: relations.map((item) =>
              serializeMetadataState(refs, item),
            ),
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
        ({
          type,
          index,
          nullable,
          relations,
        }): [number, string, boolean, string[]] => [
          index,
          type,
          nullable,
          relations.map((item) => item.hash.toString('hex')),
        ],
      )
      .sort((a, b) => a[0] - b[0]),
  );

export const syncStateCollectionNames = (
  origin: MetadataState,
  target: MetadataState,
): void => {
  target.collectionName = origin.collectionName;

  const targetFields = new Map(
    Object.values(target.fields).map((item) => [item.index, item]),
  );
  const targetFieldNames = new Map(
    Object.values(target.fields).map((item) => [item.fieldName, item]),
  );

  for (const key in origin.fields) {
    const field = origin.fields[key];
    const targetField = targetFields.get(field.index);

    if (!targetField || targetField.fieldName === field.fieldName) continue;

    const oldFieldName = targetField.fieldName;
    const overrideField = targetFieldNames.get(field.fieldName);

    targetField.fieldName = field.fieldName;
    targetFieldNames.set(targetField.fieldName, targetField);

    if (overrideField) {
      overrideField.fieldName = oldFieldName;
      targetFieldNames.set(overrideField.fieldName, overrideField);
    }
  }
};
