import { getMetadataSchema, MetadataSchema } from './schema';
import { MetadataState, MetadataStateField } from './state';

export type MetadataCollectionFieldMap = Record<
  MetadataStateField['path'],
  {
    fields: Map<MetadataStateField['name'], MetadataStateField>;
    children: Set<MetadataStateField['path']>;
  }
>;

export class MetadataCollection {
  constructor(
    public readonly name: string,
    public readonly states: MetadataState[],
  ) {}

  get schema(): MetadataSchema {
    return getMetadataSchema(this.states);
  }

  getFields(rootPath: string): MetadataStateField[] {
    return this.states.flatMap((state) =>
      state.fields.filter((field) => isRootPath(rootPath, field.path)),
    );
  }

  getFieldNames(rootPath: string): string[] {
    return [...new Set(this.getFields(rootPath).map((field) => field.name))];
  }
}

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
