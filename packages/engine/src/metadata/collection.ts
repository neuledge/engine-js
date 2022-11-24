import { MetadataState, MetadataStateField } from './state/index.js';

export type MetadataCollectionFieldMap = Record<
  MetadataStateField['path'],
  {
    fields: Map<MetadataStateField['name'], MetadataStateField>;
    children: Set<MetadataStateField['path']>;
  }
>;

export class MetadataCollection {
  // private readonly fieldMap = new Map<string, MetadataStateField[]>();

  constructor(
    public readonly name: string,
    public readonly states: MetadataState[],
  ) {
    // for (const state of states) {
    //   for (const field of state.fields) {
    //     const fields = this.fieldMap.get(field.key) ?? [];
    //     fields.push(field);
    //     this.fieldMap.set(field.key, fields);
    //   }
    // }
  }

  getFields(rootPath: string): MetadataStateField[] {
    return this.states.flatMap((state) =>
      state.fields.filter((field) => isRootPath(rootPath, field.path)),
    );
  }

  getFieldNames(rootPath: string): string[] {
    return [...new Set(this.getFields(rootPath).map((field) => field.name))];
  }

  getFieldMap(): MetadataCollectionFieldMap {
    const fields: Record<
      MetadataStateField['path'],
      {
        fields: Map<MetadataStateField['name'], MetadataStateField>;
        children: Set<MetadataStateField['path']>;
      }
    > = {};

    for (const state of this.states) {
      for (const field of state.fields) {
        const entry =
          fields[field.path] ??
          (fields[field.path] = { fields: new Map(), children: new Set() });

        entry.fields.set(field.name, field);

        const parts = field.path.split('.');
        for (parts.pop(); parts.length; parts.pop()) {
          const path = parts.join('.');

          const entry =
            fields[path] ??
            (fields[path] = { fields: new Map(), children: new Set() });

          entry.children.add(field.path);
        }
      }
    }

    return fields;
  }

  //   getFieldStates(
  //     rootPath: string,
  //   ): Record<MetadataGhostStateField['name'], StateDefinition[]> {
  //     const map: Record<MetadataGhostStateField['name'], StateDefinition[]> = {};
  //
  //     for (const state of this.states) {
  //       for (const field of state.fields) {
  //         if (isRootPath(rootPath, field.path)) {
  //           let entry = map[field.name];
  //
  //           if (!entry) {
  //             entry = [];
  //             map[field.name] = entry;
  //           }
  //
  //           entry.push(state.instance);
  //         }
  //       }
  //     }
  //
  //     return map;
  //   }
}

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
