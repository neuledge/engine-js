import { MetadataStateField } from '../state.js';

export const assignFieldNames = <
  Field extends Pick<MetadataStateField, 'name' | 'type'>,
>(
  fields: Field[],
): Field[] => {
  const duplicates = new Map<string, Field[]>();
  const assigned = new Map<string, Field>();

  // assign and find all duplicates
  for (const field of fields) {
    const exists = assigned.get(field.name);

    if (!exists) {
      assigned.set(field.name, field);
      continue;
    }

    const list = duplicates.get(field.name);
    duplicates.set(field.name, list ? [...list, field] : [exists, field]);
  }

  for (const [name, list] of duplicates) {
    if (
      list.every(
        (field) => !assigned.has(`${name}_${toSnakeCase(field.type.key)}`),
      )
    ) {
      for (const field of list) {
        assigned.set(`${name}_${toSnakeCase(field.type.key)}`, field);
      }
      continue;
    }

    let i = 1;
    for (const field of list) {
      let newName = `${name}_${i}`;
      while (assigned.has(newName)) {
        newName = `${name}_${++i}`;
      }

      assigned.set(newName, field);
    }
  }

  for (const [name, field] of assigned) {
    field.name = name;
  }

  return [...assigned.values()];
};

const toSnakeCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
