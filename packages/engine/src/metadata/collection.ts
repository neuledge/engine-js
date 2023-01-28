import {
  StoreCollection,
  StoreField,
  StoreIndex,
  StorePrimaryKey,
} from '@neuledge/store';
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

export class MetadataCollection implements StoreCollection {
  readonly reservedNames: MetadataStateReservedNames;
  readonly schema: MetadataSchema;
  readonly primaryKey: StorePrimaryKey;
  readonly indexes: Record<StoreIndex['name'], StoreIndex>;
  readonly fields: Record<StoreField['name'], StoreField>;

  constructor(
    public readonly name: string,
    public readonly states: MetadataState[],
  ) {
    this.fields = getStoreCollectionFields(states);

    // FIXME indexes and primaryIndex
    this.indexes = {};
    this.primaryKey = { name: 'primary', fields: [], primary: true };

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

const getStoreCollectionFields = (
  states: MetadataState[],
): StoreCollection['fields'] => {
  const fields: StoreCollection['fields'] = {};

  for (const state of states) {
    for (const field of state.fields) {
      const storeField = fields[field.name];

      if (!storeField) {
        fields[field.name] = getStoreField(field);
      } else if (field.nullable && !storeField.nullable) {
        storeField.nullable = true;
      }
    }
  }

  return fields;
};

const getStoreField = (field: MetadataStateField): StoreField => ({
  name: field.name,
  // FIXME handle field properties by type
  type: 'string',
  // size: field.size,
  // values: field.values,
  nullable: field.nullable,
});

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
