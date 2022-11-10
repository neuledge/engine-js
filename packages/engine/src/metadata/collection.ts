import { State } from '@/generated/index.js';
import { MetadataOriginState, MetadataStateField } from './state.js';

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

  //   getFields(key: string): MetadataStateField[] {
  //     return this.states.flatMap((state) =>
  //       state.fields.filter((field) => field.key === key),
  //     );
  //   }
  //
  //   getFieldNames(key: string): string[] {
  //     return [...new Set(this.getFields(key).map((field) => field.name))];
  //   }
  //
  //   getFieldNameStates(key: string): Record<MetadataStateField['name'], State[]> {
  //     const map: Record<MetadataStateField['name'], State[]> = {};
  //
  //     for (const state of this.states) {
  //       const fieldName = state.origin.$scalars[key]?.fieldName;
  //       if (!fieldName) continue;
  //
  //       const stateKeys = map[fieldName] ?? (map[fieldName] = []);
  //       stateKeys.push(state.origin);
  //     }
  //
  //     return map;
  //   }
}
