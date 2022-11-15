import { resolveDefer, StateScalar, State } from '@/generated/index.js';
import { Scalar } from '@neuledge/scalars';
import { generateHash } from './hash.js';

export type MetadataStateHash = Buffer;

export interface MetadataState {
  collectionName: string;
  key: string;
  hash: MetadataStateHash;
  fields: MetadataStateField[];
  origin?: State;
}

export interface MetadataOriginState extends MetadataState {
  fields: MetadataOriginStateField[];
  origin: State;
}

export interface MetadataStateField {
  name: string;
  path?: string[];
  indexes: number[];
  type: Scalar;
  nullable: boolean;
  relations?: MetadataStateRelation[];
}

export interface MetadataOriginStateField extends MetadataStateField {
  path: string[];
}

export interface MetadataStateRelation {
  state: MetadataState;
  path: string[];
}

// state

export const toMetadataState = (state: State): MetadataOriginState => {
  const fields: MetadataOriginState['fields'] = [];

  const scalars = resolveDefer(state.$scalars);
  for (const key in scalars) {
    fields.push(...getScalarFields(key, [key], scalars[key]));
  }

  return {
    collectionName: state.$key,
    key: state.$key,
    hash: generateStateHash(fields),
    fields,
    origin: state,
  };
};

export const isStatesMatches = (
  actual: MetadataState,
  target: MetadataState,
): boolean => {
  if (actual.hash.equals(target.hash)) return true;

  const actualFields = new Map(
    actual.fields.map((item) => [getMetadataStateFieldKey(item), item]),
  );

  return Object.values(target.fields).every((targetField) => {
    const actualField = actualFields.get(getMetadataStateFieldKey(targetField));
    if (!actualField) {
      return targetField.nullable;
    }

    return !actualField.nullable || targetField.nullable;
  });
};

const generateStateHash = (
  fields: MetadataState['fields'],
): MetadataStateHash =>
  generateHash(
    fields.map((field) => getMetadataStateFieldKey(field, true)).sort(),
  );

export const syncMetadataStates = (
  origin: MetadataState,
  target: MetadataState,
): void => {
  target.collectionName = origin.collectionName;

  const targetFields = new Map(
    target.fields.map((field) => [getMetadataStateFieldKey(field), field]),
  );
  const targetFieldNames = new Map(
    target.fields.map((field) => [field.name, field]),
  );

  for (const key in origin.fields) {
    const field = origin.fields[key];
    const targetField = targetFields.get(getMetadataStateFieldKey(field));

    if (!targetField || targetField.name === field.name) continue;

    const oldFieldName = targetField.name;
    const overrideField = targetFieldNames.get(field.name);

    targetField.name = field.name;
    targetFieldNames.set(targetField.name, targetField);

    if (overrideField) {
      overrideField.name = oldFieldName;
      targetFieldNames.set(overrideField.name, overrideField);
    }
  }
};

// field

const getScalarFields = (
  name: string,
  path: string[],
  def: StateScalar,
  parentIndexes: number[] = [],
): MetadataOriginStateField[] => {
  const { type, index, nullable } = def;

  const indexes = [...parentIndexes, index];

  if ('length' in type) {
    const fieldMap = new Map<string, MetadataOriginStateField>();

    for (const child of type) {
      const childDef = resolveDefer(child.$scalars);

      for (const id of child.$id) {
        for (const item of getScalarFields(
          `${name}_${id}`,
          [...path, id],
          childDef[id],
          indexes,
        )) {
          const mapKey = getMetadataStateFieldKey(item);
          const value = fieldMap.get(mapKey);

          if (!value?.nullable) {
            fieldMap.set(mapKey, item);
          }
        }
      }
    }

    return [...fieldMap.values()];
  }

  return [
    {
      name,
      path,
      indexes,
      type,
      nullable: nullable ?? false,
    },
  ];
};

const getMetadataStateFieldKey = (
  field: MetadataStateField,
  strict?: boolean,
): string =>
  `${field.indexes.join('/')}#${field.type}${
    strict && field.nullable ? '?' : ''
  }`;
