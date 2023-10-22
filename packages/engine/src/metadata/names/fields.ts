import { StateFieldSnapshot } from '../state';

/**
 * Will check that all field names within all states are pointing to the same
 * field type. If not, it will rename the field name to be unique.
 *
 * Rename will be done by appending the field type name to the field name. If
 * the field name already contains the field type name, or if the field name
 * already exists, it will append a number to the field name.
 */
export const renameDuplicateFieldNames = <
  Field extends Pick<StateFieldSnapshot, 'name' | 'type'>,
>(
  states: {
    fields: Field[];
  }[],
): void => {
  // generate a 3d map of name -> type -> fields[]
  const fieldMap = generateFieldMap(states);

  // rename duplicate fields
  for (const [name, typeMap] of fieldMap) {
    if (typeMap.size === 1) continue;

    // check if the type is already exists in the name
    const hasTypeInName = typeMap.has(
      toSnakeCase(name.split('_').pop() as string),
    );
    let index = 0;

    for (const [type, list] of typeMap) {
      let newName = `${name}_${type}`;

      if (hasTypeInName || fieldMap.has(newName)) {
        if (index === 0) {
          // keep the first duplicate name as is
          index = 1;
          continue;
        }

        do {
          newName = `${name}_${++index}`;
        } while (fieldMap.has(newName));
      }

      // reindex the field map
      fieldMap.set(newName, new Map([[type, list]]));
      typeMap.delete(type);

      // rename the fields
      for (const field of list) {
        field.name = newName;
      }
    }
  }
};

const generateFieldMap = <
  Field extends Pick<StateFieldSnapshot, 'name' | 'type'>,
>(
  states: {
    fields: Field[];
  }[],
): Map<Field['name'], Map<Field['type']['name'], Field[]>> => {
  const fieldMap = new Map<
    Field['name'],
    Map<Field['type']['name'], Field[]>
  >();

  for (const { fields } of states) {
    for (const field of fields) {
      let typeMap = fieldMap.get(field.name);
      if (!typeMap) {
        typeMap = new Map();
        fieldMap.set(field.name, typeMap);
      }

      const type = toSnakeCase(field.type.name);
      let list = typeMap.get(type);
      if (!list) {
        list = [];
        typeMap.set(type, list);
      }

      list.push(field);
    }
  }

  return fieldMap;
};

export const toSnakeCase = (str: string): string =>
  str.replaceAll(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
