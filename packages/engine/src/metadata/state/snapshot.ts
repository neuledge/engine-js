import { StateDefinition } from '@/definitions';
import { generateHash } from '../hash';
import { getMetadataStateFieldKey, StateFieldSnapshot } from './field';

export type StateSnapshotHash = Buffer;

export interface StateRelationSnapshot {
  name: string;
  states: StateSnapshot[];
  path?: string;
  index: number;
}

export class StateSnapshot {
  collectionName!: string;
  name!: string;
  hash!: StateSnapshotHash;
  fields!: StateFieldSnapshot[];
  instance?: StateDefinition;
  relations!: StateRelationSnapshot[];

  /**
   * Check that the origin state matches the current state signature.
   * The state can match if one of the following conditions is true:
   * - the hash is the same
   * - the current state has all the required fields of the origin state
   */
  matches(origin: StateSnapshot): boolean {
    if (this.hash.equals(origin.hash)) return true;

    const existingFields = new Map(
      this.fields.map((item) => [getMetadataStateFieldKey(item), item]),
    );

    return Object.values(origin.fields).every((originField) => {
      const existsField = existingFields.get(
        getMetadataStateFieldKey(originField),
      );
      if (!existsField) {
        return originField.nullable;
      }

      return !existsField.nullable || originField.nullable;
    });
  }

  /**
   * Sync the current state with the origin state.
   * This will update the collection name and store field names to match the
   * origin state representation on the store. This is useful when the state
   * rename a field and we want to keep the same name on the store for backward
   * compatibility.
   */
  sync(origin: StateSnapshot): void {
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
    origin: Omit<StateSnapshot, 'matches' | 'sync' | 'clone' | 'assign'>,
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
  state: Pick<StateSnapshot, 'fields' | 'relations'>,
): StateSnapshotHash =>
  generateHash([
    state.fields.map((field) => getMetadataStateFieldKey(field, true)).sort(),
    state.relations
      .map((relation) => getMetadataStateRelationKey(relation))
      .sort(),
  ]);

const getMetadataStateRelationKey = (relation: StateRelationSnapshot): string =>
  `${relation.index}#${relation.states
    .map((state) =>
      generateStateHash({ fields: state.fields, relations: [] }).toString(
        'base64url',
      ),
    )
    .join('|')}`;
