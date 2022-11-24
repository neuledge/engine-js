import { MetadataGhostStateField } from '../state/index.js';

export const assignFieldNames = <
  Field extends Pick<MetadataGhostStateField, 'name' | 'type'>,
>(
  fields: Field[],
): void => {
  const duplicates = new Map<string, Field[]>();

  // list duplicates
  for (const field of fields) {
    let list = duplicates.get(field.name);

    if (!list) {
      list = [];
      duplicates.set(field.name, list);
    }

    list.push(field);
  }

  const assigned = new Map<string, Field>();

  // assign single names
  for (const [name, list] of duplicates) {
    if (list.length !== 1) continue;

    assigned.set(name, list[0]);
    duplicates.delete(name);
  }

  for (const [name, list] of duplicates) {
    const names = list.map((field) => `${name}_${toSnakeCase(field.type.key)}`);

    if (
      names.every((item) => !assigned.has(item)) &&
      new Set(names).size === names.length
    ) {
      for (const [i, field] of list.entries()) {
        assigned.set(names[i], field);
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
};

const toSnakeCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
