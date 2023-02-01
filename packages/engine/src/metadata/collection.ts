import { parseSortedField, SortDefinition } from '@/definitions';
import { NeuledgeError } from '@/error';
import {
  StoreCollection,
  StoreField,
  StoreIndex,
  StoreIndexField,
  StorePrimaryKey,
} from '@neuledge/store';
import {
  getMetadataSchema,
  MetadataSchema,
  MetadataSchemaChoice,
} from './schema';
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
    this.schema = getMetadataSchema(this.states);

    const { indexes, primaryKey } = getStoreIndexes(this.schema, states);

    this.indexes = indexes;
    this.primaryKey = primaryKey;

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

  // count field name references by states
  const refCount = new Map<string, number>();

  // add fields from states, prefer nullable fields
  for (const state of states) {
    for (const field of state.fields) {
      const storeField = fields[field.name];

      if (!storeField) {
        fields[field.name] = getStoreField(field);
      } else if (field.nullable && !storeField.nullable) {
        storeField.nullable = true;
      }

      const count = refCount.get(field.name) ?? 0;
      refCount.set(field.name, count + 1);
    }
  }

  // set field to nullable if it is not referenced by all states
  for (const [name, count] of refCount) {
    if (count === states.length) continue;

    const field = fields[name];
    field.nullable = true;
  }

  return fields;
};

const getStoreField = (field: MetadataStateField): StoreField => ({
  name: field.name,
  ...field.type.shape,
  nullable: field.nullable,
});

const getStoreIndexes = (
  schema: MetadataSchema,
  states: MetadataState[],
): Pick<StoreCollection, 'indexes' | 'primaryKey'> => {
  const indexes: StoreCollection['indexes'] = {};
  const primaryKey: StoreCollection['primaryKey'] = {
    name: '', // will be set by `applyPrimaryKey`
    fields: getStoreIndexFields(schema, states[0].instance.$id.fields),
    unique: 'primary',
    auto: states[0].instance.$id.auto,
  };

  for (const state of states) {
    for (const [name, index] of Object.entries(state.instance.$indexes ?? {})) {
      indexes[name] = {
        name,
        fields: getStoreIndexFields(schema, index.fields),
        unique: index.unique,
      };
    }
  }

  applyPrimaryKey(indexes, primaryKey);

  return { indexes, primaryKey } as const;
};

const getStoreIndexFields = (
  schema: MetadataSchema,
  sortDefinition: SortDefinition<Record<string, unknown>>,
): StoreIndex['fields'] => {
  const fields: StoreIndex['fields'] = {};

  for (const sortField of sortDefinition) {
    const [name, direction] = parseSortedField(sortField);
    const indexField: StoreIndexField = { direction };

    const choices = schema[name];
    if (!choices) {
      throw new NeuledgeError(
        NeuledgeError.Code.UNKNOWN_SORT_FIELD,
        `Unknown sort field: '${name}'`,
      );
    }

    assignStoreIndexField(fields, choices, indexField);
  }

  return fields;
};

const assignStoreIndexField = (
  fields: StoreIndex['fields'],
  choices: (MetadataSchemaChoice | undefined)[],
  indexField: StoreIndexField,
): void => {
  for (const choice of choices) {
    if (!choice) continue;

    if (choice.field) {
      fields[choice.field.name] = indexField;
      continue;
    }

    assignStoreIndexField(
      fields,
      Object.values(choice.schema).flatMap((item) => item ?? []),
      indexField,
    );
  }
};

const applyPrimaryKey = (
  indexes: StoreCollection['indexes'],
  primaryKey: StoreCollection['primaryKey'],
): void => {
  const primaryKeyName = Object.keys(primaryKey.fields).join('_');

  primaryKey.name = primaryKeyName;
  for (let i = 2; indexes[primaryKey.name]; i++) {
    primaryKey.name = `${primaryKeyName}_${i}`;
  }

  indexes[primaryKey.name] = primaryKey;
};

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
