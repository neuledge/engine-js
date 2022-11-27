import { MetadataState, MetadataStateField } from './state/index.js';

export type MetadataSchema = {
  [Key in string]?: MetadataSchemaChoice[];
};

export type MetadataSchemaChoice =
  | { field: MetadataStateField; schema?: never }
  | { field?: never; schema: MetadataSchema };

const cache = new Map<string, MetadataSchema>();

export const getMetadataSchema = (states: MetadataState[]): MetadataSchema => {
  const key = getSchemaKey(states);
  let schema = cache.get(key);

  if (!schema) {
    schema = {};
    cache.set(key, schema);

    Object.assign(schema, buildMetadataSchema(states));
  }

  return schema;
};

const getSchemaKey = (states: MetadataState[]): string =>
  JSON.stringify(
    states
      .map((state) => `${state.name}#${state.hash.toString('base64url')}`)
      .sort(),
  );

const buildMetadataSchema = (
  states: MetadataState[],
  parent?: { state: MetadataState; path: string },
): MetadataSchema => {
  const { fieldsMap, statesMap } = indexMetadataSchema(states, parent);

  const schema: MetadataSchema = {};

  for (const [path, fields] of fieldsMap) {
    let choices = schema[path];

    if (!choices) {
      choices = schema[path] = [];
    }

    for (const field of fields.values()) {
      choices.push({ field });
    }
  }

  for (const [path, item] of statesMap) {
    let choices = schema[path];

    if (!choices) {
      choices = schema[path] = [];
    }

    for (const schema of item.values()) {
      choices.push({ schema });
    }
  }

  return schema;
};

const indexMetadataSchema = (
  states: MetadataState[],
  parent?: { state: MetadataState; path: string },
) => {
  const fieldsMap = new Map<string, Map<string, MetadataStateField>>();
  const statesMap = new Map<string, Map<string, MetadataSchema>>();

  for (const state of states) {
    for (const field of (parent?.state ?? state).fields) {
      let { path } = field;
      const { name } = field;

      if (parent) {
        if (!path.startsWith(`${parent.path}.`)) continue;

        path = path.slice(parent.path.length + 1);
      }

      let fields = fieldsMap.get(path);

      if (!fields) {
        fields = new Map();
        fieldsMap.set(path, fields);
      }

      fields.set(name, field);
    }

    for (const relation of state.relations) {
      let { path } = relation;

      if (parent) {
        if (!path.startsWith(`${parent.path}.`)) continue;

        path = path.slice(parent.path.length + 1);
      }

      let states = statesMap.get(path);

      if (!states) {
        states = new Map();
        statesMap.set(path, states);
      }

      const key = getSchemaKey(relation.states);

      if (!states.has(key)) {
        states.set(
          key,
          buildMetadataSchema(relation.states, {
            state,
            path: parent ? `${parent.path}.${path}` : path,
          }),
        );
      }
    }
  }

  return { fieldsMap, statesMap };
};
