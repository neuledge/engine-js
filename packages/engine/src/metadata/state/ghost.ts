import { StateDefinition } from '@/definitions/index.js';
import { generateHash } from '../hash.js';
import { getMetadataStateFieldKey, MetadataGhostStateField } from './field.js';

export type MetadataStateHash = Buffer;

export interface MetadataGhostStateRelation {
  name: string;
  states: MetadataGhostState[];
  path?: string;
  index: number;
}

export class MetadataGhostState {
  collectionName!: string;
  name!: string;
  hash!: MetadataStateHash;
  fields!: MetadataGhostStateField[];
  instance?: StateDefinition;
  relations!: MetadataGhostStateRelation[];

  matches(target: MetadataGhostState): boolean {
    if (this.hash.equals(target.hash)) return true;

    const actualFields = new Map(
      this.fields.map((item) => [getMetadataStateFieldKey(item), item]),
    );

    return Object.values(target.fields).every((targetField) => {
      const actualField = actualFields.get(
        getMetadataStateFieldKey(targetField),
      );
      if (!actualField) {
        return targetField.nullable;
      }

      return !actualField.nullable || targetField.nullable;
    });
  }

  sync(origin: MetadataGhostState): void {
    this.collectionName = origin.collectionName;

    const targetFields = new Map(
      this.fields.map((field) => [getMetadataStateFieldKey(field), field]),
    );
    const targetFieldNames = new Map(
      this.fields.map((field) => [field.name, field]),
    );

    for (const key in origin.fields) {
      const field = origin.fields[key];
      const targetField = targetFields.get(getMetadataStateFieldKey(field));

      if (!targetField || targetField.name === field.name) continue;

      const oldFieldName = targetField.name;
      const overrideField = targetFieldNames.get(field.name);

      targetField.name = field.name;
      targetFieldNames.set(targetField.name, targetField);

      if (overrideField) {
        overrideField.name = oldFieldName;
        targetFieldNames.set(overrideField.name, overrideField);
      }
    }
  }

  clone(): this {
    return Object.assign(Object.create(this), this);
  }

  assign(
    origin: Omit<MetadataGhostState, 'matches' | 'sync' | 'clone' | 'assign'>,
  ): this {
    this.collectionName = origin.collectionName;
    this.name = origin.name;
    this.hash = origin.hash;
    this.fields = origin.fields;
    this.relations = origin.relations;

    return this;
  }
}

// state

export const generateStateHash = (
  state: Pick<MetadataGhostState, 'fields' | 'relations'>,
): MetadataStateHash =>
  generateHash([
    state.fields.map((field) => getMetadataStateFieldKey(field, true)).sort(),
    state.relations
      .map((relation) => getMetadataStateRelationKey(relation))
      .sort(),
  ]);

const getMetadataStateRelationKey = (
  relation: MetadataGhostStateRelation,
): string =>
  `${relation.index}#${relation.states
    .map((state) =>
      generateStateHash({ fields: state.fields, relations: [] }).toString(
        'base64url',
      ),
    )
    .join('|')}`;
