import { State } from '@/generated/index.js';
import { MetadataLiveState, MetadataStateField } from './state.js';

export class MetadataCollection {
  constructor(
    public readonly name: string,
    public readonly states: MetadataLiveState[],
  ) {}

  getFields(key: string): MetadataStateField[] {
    return this.states.map((state) => state.fields[key]).filter(Boolean);
  }

  getFieldNames(key: string): string[] {
    return [...new Set(this.getFields(key).map((field) => field.fieldName))];
  }

  getFieldNameStates(
    key: string,
  ): Record<MetadataStateField['fieldName'], State[]> {
    const map: Record<MetadataStateField['fieldName'], State[]> = {};

    for (const state of this.states) {
      const fieldName = state.fields[key]?.fieldName;
      if (!fieldName) continue;

      const stateKeys = map[fieldName] ?? (map[fieldName] = []);
      stateKeys.push(state.origin);
    }

    return map;
  }
}
