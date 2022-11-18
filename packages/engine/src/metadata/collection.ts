import { StateDefinition } from '@/definitions/index.js';
import {
  MetadataOriginState,
  MetadataOriginStateField,
  MetadataStateField,
} from './state.js';

export class MetadataCollection {
  // private readonly fieldMap = new Map<string, MetadataStateField[]>();

  constructor(
    public readonly name: string,
    public readonly states: MetadataOriginState[],
  ) {
    // for (const state of states) {
    //   for (const field of state.fields) {
    //     const fields = this.fieldMap.get(field.key) ?? [];
    //     fields.push(field);
    //     this.fieldMap.set(field.key, fields);
    //   }
    // }
  }

  getFields(rootPath: string): MetadataOriginStateField[] {
    return this.states.flatMap((state) =>
      state.fields.filter((field) => isRootPath(rootPath, field.path)),
    );
  }

  getFieldNames(rootPath: string): string[] {
    return [...new Set(this.getFields(rootPath).map((field) => field.name))];
  }

  getFieldStates(
    rootPath: string,
  ): Record<MetadataStateField['name'], StateDefinition[]> {
    const map: Record<MetadataStateField['name'], StateDefinition[]> = {};

    for (const state of this.states) {
      for (const field of state.fields) {
        if (isRootPath(rootPath, field.path)) {
          let entry = map[field.name];

          if (!entry) {
            entry = [];
            map[field.name] = entry;
          }

          entry.push(state.origin);
        }
      }
    }

    return map;
  }
}

const isRootPath = (rootPath: string, path: string): boolean =>
  path.startsWith(rootPath) &&
  (path.length === rootPath.length || path[rootPath.length] === '.');
