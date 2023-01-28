import { MetadataState, MetadataStateField } from './state';

/**
 * Metadata schema contain for each where path a set of choices, each choice
 * can be a field or a sub schema.
 */
export type MetadataSchema = {
  [Path in string]?: MetadataSchemaChoice[];
};

/**
 * A schema choice can be a field or a sub schema.
 */
export type MetadataSchemaChoice =
  | { field: MetadataStateField; schema?: never }
  | { field?: never; schema: MetadataSchema };

/**
 * Get the metadata schema from the given states.
 * This function will be used recursively to build the schema for the relation
 * fields. If a relation parent provided, only include the fields that are under
 * the parent path will be included.
 */
export const getMetadataSchema = (
  states: MetadataState[],
  relationParent?: { state: MetadataState; path: string },
): MetadataSchema => {
  const schemaMap: Record<string, Record<string, MetadataSchemaChoice>> = {};

  for (const state of states) {
    // query the state fields and build the field choices
    // if a relation parent provided, only include the fields that are under
    // the parent path
    for (const field of (relationParent?.state ?? state).fields) {
      let { path } = field;
      if (relationParent) {
        if (!path.startsWith(`${relationParent.path}.`)) continue;

        path = path.slice(relationParent.path.length + 1);
      }

      let pathChoices = schemaMap[path];
      if (!pathChoices) {
        pathChoices = schemaMap[path] = {};
      }

      const key = getFieldKey(field);
      if (pathChoices[key]) continue;

      pathChoices[key] = { field };
    }

    // query the state relations and build the schema choices
    // if a relation parent provided, only include the relations that are under
    // the parent path
    for (const relation of state.relations) {
      let { path } = relation;

      if (relationParent) {
        if (!path.startsWith(`${relationParent.path}.`)) continue;

        path = path.slice(relationParent.path.length + 1);
      }

      let pathChoices = schemaMap[path];
      if (!pathChoices) {
        pathChoices = schemaMap[path] = {};
      }

      const key = getSchemaKey(relation.states);
      if (pathChoices[key]) continue;

      const childSchema = getMetadataSchema(relation.states, { state, path });
      pathChoices[key] = { schema: childSchema };
    }
  }

  // convert the schema map to a schema object without the choices keys
  return Object.fromEntries(
    Object.entries(schemaMap).map(([path, choices]) => [
      path,
      Object.values(choices),
    ]),
  );
};

/**
 * Get a unique field key
 */
const getFieldKey = (field: MetadataStateField): string =>
  `${field.name}:${field.type.name}${field.nullable ? '?' : ''}`;

/**
 * Get a unique schema key
 */
const getSchemaKey = (states: MetadataState[]): string =>
  JSON.stringify(
    states
      .map((state) => `${state.name}#${state.hash.toString('base64url')}`)
      .sort(),
  );
