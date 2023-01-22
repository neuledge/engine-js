import { fromSortedField } from '@/definitions';
import { getMetadataSchema, MetadataSchema } from './schema';
import {
  MetadataState,
  MetadataStateField,
  MetadataStateReservedNames,
} from './state';

export type MetadataCollectionFieldMap = Record<
  MetadataStateField['path'],
  {
    fields: Map<MetadataStateField['name'], MetadataStateField>;
    children: Set<MetadataStateField['path']>;
  }
>;

export class MetadataCollection {
  readonly reservedNames: MetadataStateReservedNames;
  readonly schema: MetadataSchema;
  readonly primaryKeys: string[];

  constructor(
    public readonly name: string,
    public readonly states: MetadataState[],
  ) {
    this.primaryKeys = this.states[0].instance.$id.fields.map((key) =>
      fromSortedField(key),
    );

    this.schema = getMetadataSchema(this.states);
    this.reservedNames = this.states[0].reservedNames;
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
