import { parseSortedField, SortDefinition } from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import {
  StoreCollection,
  StoreField,
  StoreIndex,
  StoreIndexField,
  StorePrimaryKey,
  StoreSortDirection,
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

    const { indexes, primaryKey } = getStoreIndexes(
      this.fields,
      this.schema,
      states,
    );

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
  // FIXME handle field properties by type
  type: 'json',
  // size: field.size,
  // values: field.values,
  nullable: field.nullable,
});

const getStoreIndexes = (
  fields: MetadataCollection['fields'],
  schema: MetadataSchema,
  states: MetadataState[],
): Pick<StoreCollection, 'indexes' | 'primaryKey'> => {
  const indexes: StoreCollection['indexes'] = {};
  const primaryKey: StoreCollection['primaryKey'] = {
    name: '', // will be set by `applyPrimaryKey`
    fields: getStoreIndexFields(fields, schema, states[0].instance.$id.fields),
    unique: 'primary',
    auto: states[0].instance.$id.auto,
  };

  for (const state of states) {
    for (const [name, index] of Object.entries(state.instance.$indexes ?? {})) {
      indexes[name] = {
        name,
        fields: getStoreIndexFields(fields, schema, index.fields),
        unique: index.unique,
      };
    }
  }

  applyPrimaryKey(indexes, primaryKey);

  return { indexes, primaryKey } as const;
};

const getStoreIndexFields = (
  fields: MetadataCollection['fields'],
  schema: MetadataSchema,
  sortDefinition: SortDefinition<Record<string, unknown>>,
): StoreIndex['fields'] => {
  const res: StoreIndex['fields'] = [];

  for (const sortField of sortDefinition) {
    const [name, direction] = parseSortedField(sortField);

    const choices = schema[name];
    if (!choices) {
      throw new NeuledgeError(
        NeuledgeErrorCode.UNKNOWN_SORT_FIELD,
        `Unknown sort field: '${name}'`,
      );
    }

    res.push(...getStoreIndexField(fields, choices, direction));
  }

  return res;
};

const getStoreIndexField = (
  fields: MetadataCollection['fields'],
  choices: (MetadataSchemaChoice | undefined)[],
  direction: StoreSortDirection,
): StoreIndexField[] =>
  choices.flatMap((choice): StoreIndexField[] => {
    if (!choice) {
      return [];
    }

    if (choice.field) {
      return [{ field: fields[choice.field.name], direction }];
    }

    return getStoreIndexField(
      fields,
      Object.values(choice.schema).flatMap((item) => item ?? []),
      direction,
    );
  });

const applyPrimaryKey = (
  indexes: StoreCollection['indexes'],
  primaryKey: StoreCollection['primaryKey'],
): void => {
  const primaryKeyName = primaryKey.fields
    .map((field) => field.field.name)
    .join('_');

  primaryKey.name = primaryKeyName;
  for (let i = 2; indexes[primaryKey.name]; i++) {
    primaryKey.name = `${primaryKeyName}_${i}`;
  }

  indexes[primaryKey.name] = primaryKey;
};

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
