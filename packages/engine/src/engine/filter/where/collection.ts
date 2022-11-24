import { MetadataCollectionFieldMap } from '@/metadata/index.js';

export const getRecursiveWhereFields = function* (
  fieldMap: MetadataCollectionFieldMap,
  path: string,
  value: unknown,
): Generator<[path: string, value: unknown]> {
  const pathFields = fieldMap[path];
  if (pathFields == null) {
    throw new Error(`Unknown where path: '${path}'`);
  }

  if (pathFields.fields.size) {
    yield [path, value];
  }

  if (pathFields.children.size && typeof value === 'object' && value != null) {
    for (const [key, item] of Object.entries(value)) {
      yield* getRecursiveWhereFields(fieldMap, `${path}.${key}`, item);
    }
  }
};
