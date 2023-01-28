import {
  fromSortedField,
  isStateDefinitionScalarTypeScalar,
  resolveDefer,
  StateDefintionScalar,
} from '@/definitions';
import { Scalar } from '@neuledge/scalars';

export interface StateFieldSnapshot {
  name: string;
  path?: string;
  indexes: number[];
  type: Scalar;
  nullable: boolean;
}

export interface MetadataStateField extends StateFieldSnapshot {
  path: string;
}

export const getMetadataStateFieldKey = (
  field: StateFieldSnapshot,
  strict?: boolean,
): string =>
  `${field.indexes.join(':')}#${field.type}${
    strict && field.nullable ? '?' : ''
  }`;

/**
 * Generate list of scalar fields from field definition. Usually, each field definition
 * will have only one scalar field, but in case of nested states, it may have multiple
 * fields, as the number of primary keys in the nested state.
 *
 * We will assign a unique name to each field, and the path will match the original
 * field destination, using dot notation for nested fields. For example, if we have
 * a field named `user` that is a nested state, and the nested state has a primary
 * key named `id`, the field name will be `user_id`, and the path will be `user.id`.
 *
 * The indexes will be the indexes of the parent state, plus the index of the field
 * in the current state. Top level fields will have only one item in the indexes array
 * that equals the index of the field in the state.
 */
export const getScalarFields = (
  name: string,
  path: string,
  scalarDef: StateDefintionScalar,
  parentIndexes: number[] = [],
): MetadataStateField[] => {
  const { type, index, nullable } = scalarDef;

  const indexes = [...parentIndexes, index];

  // type is scalar
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

  // `type` is array of possible states
  for (const childState of type) {
    const scalars = resolveDefer(childState.$scalars);

    // query only the primary key fields
    for (const sortKey of childState.$id.fields) {
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
          // prefer nullable fields and overwrite existing field if the current
          // field is not nullable
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
