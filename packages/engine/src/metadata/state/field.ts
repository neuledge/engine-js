import {
  fromSortedField,
  isStateDefinitionScalarTypeScalar,
  resolveDefer,
  StateDefintionScalar,
} from '@/definitions/index.js';
import { Scalar } from '@neuledge/scalars';

export interface MetadataGhostStateField {
  name: string;
  path?: string;
  indexes: number[];
  type: Scalar;
  nullable: boolean;
}

export interface MetadataStateField extends MetadataGhostStateField {
  path: string;
}

export const getMetadataStateFieldKey = (
  field: MetadataGhostStateField,
  strict?: boolean,
): string =>
  `${field.indexes.join(':')}#${field.type}${
    strict && field.nullable ? '?' : ''
  }`;

export const getScalarFields = (
  name: string,
  path: string,
  scalarDef: StateDefintionScalar,
  parentIndexes: number[] = [],
): MetadataStateField[] => {
  const { type, index, nullable } = scalarDef;

  const indexes = [...parentIndexes, index];

  if (isStateDefinitionScalarTypeScalar(type)) {
    return [
      {
        name,
        path,
        indexes,
        type,
        nullable: nullable ?? false,
      },
    ];
  }

  const fieldMap = new Map<string, MetadataStateField>();
  const refCount = new Map<string, number>();

  for (const childState of type) {
    const scalars = resolveDefer(childState.$scalars);

    for (const sortKey of childState.$id) {
      const id = fromSortedField(sortKey);
      const childScalarDef = scalars[id];

      const scalarFields = getScalarFields(
        `${name}_${id}`,
        `${path}.${id}`,
        childScalarDef,
        indexes,
      );

      for (const item of scalarFields) {
        const mapKey = getMetadataStateFieldKey(item);
        const value = fieldMap.get(mapKey);

        if (!value || (!value.nullable && item.nullable)) {
          // prefer nullable fields
          fieldMap.set(mapKey, item);
        }

        refCount.set(mapKey, (refCount.get(mapKey) ?? 0) + 1);
      }
    }
  }

  // set field to nullable if it is not referenced by all states
  for (const [key, field] of fieldMap) {
    if (field.nullable || refCount.get(key) === type.length) {
      continue;
    }

    field.nullable = true;
  }

  return [...fieldMap.values()];
};
