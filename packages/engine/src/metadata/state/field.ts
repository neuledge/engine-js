import {
  isStateDefinitionScalarTypeStates,
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
  def: StateDefintionScalar,
  parentIndexes: number[] = [],
): MetadataStateField[] => {
  const { type, index, nullable } = def;

  const indexes = [...parentIndexes, index];

  if (isStateDefinitionScalarTypeStates(type)) {
    const fieldMap = new Map<string, MetadataStateField>();

    for (const child of type) {
      const childDef = resolveDefer(child.$scalars);

      for (const sortKey of child.$id) {
        // FIXME use function from metadata/state/field.ts
        const id = (sortKey as string).slice(1);

        for (const item of getScalarFields(
          `${name}_${id}`,
          `${path}.${id}`,
          childDef[id as never],
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
