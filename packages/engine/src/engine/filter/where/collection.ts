import { MetadataCollectionFieldMap } from '@/metadata/index.js';

export const getRecursiveWhereFields = function* (
  fieldMap: MetadataCollectionFieldMap,
  path: string,
  value: unknown,
): Generator<[path: string, value: unknown]> {
  const [self, children] = lookupWherePath(fieldMap, path, value);

  if (self) {
    yield [path, value];
  }

  if (children) {
    for (const child of children) {
      yield* getRecursiveWhereInFields(fieldMap, path, child);
    }
  }
};

const lookupWherePath = (
  fieldMap: MetadataCollectionFieldMap,
  path: string,
  value: unknown,
): [self: boolean, value: object[] | null] => {
  const pathFields = fieldMap[path];
  if (pathFields == null) {
    throw new Error(`Unknown where path: '${path}'`);
  }

  return [
    !!pathFields.fields.size,
    pathFields.children.size && typeof value === 'object'
      ? Array.isArray(value)
        ? value
        : [value]
      : null,
  ];
};

const getRecursiveWhereInFields = function* (
  fieldMap: MetadataCollectionFieldMap,
  path: string,
  children: object,
): Generator<[path: string, value: unknown]> {
  for (const [key, item] of Object.entries(children)) {
    yield* getRecursiveWhereFields(fieldMap, `${path}.${key}`, item);
  }
};
