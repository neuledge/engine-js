import { Scalar } from '@neuledge/scalars';
import { MetadataChange } from './change';
import { StateSnapshot } from './state';

const HASH_KEY_ENCODING = 'base64url';

/**
 * MetadataSnapshot is a snapshot of the metadata state at a given point in time
 * and provides a way to query the metadata state by hash, key, or type. It's
 * built from a list of snapshot states that may or may not exist in the codebase
 * anymore.
 */
export class MetadataSnapshot<S extends StateSnapshot = StateSnapshot> {
  private readonly typeMap: Partial<Record<string, Scalar>>;
  private readonly hashMap: Partial<Record<string, StateSnapshot | S>>;
  private readonly keyMap: Partial<Record<string, S>>;

  constructor(states: Iterable<S>) {
    this.typeMap = {};
    this.hashMap = {};
    this.keyMap = {};

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      for (const { type } of entity.fields) {
        if (this.typeMap[type.name] == null) {
          this.typeMap[type.name] = type;
        }
      }

      this.keyMap[entity.name] = entity;
    }
  }

  get states(): S[] {
    return Object.values(this.keyMap) as S[];
  }

  findType(key: string): Scalar | undefined {
    return this.typeMap[key];
  }

  findStateByHash(hash: Buffer): StateSnapshot | undefined {
    return this.hashMap[hash.toString(HASH_KEY_ENCODING)];
  }

  findStateByKey(key: string): S | undefined {
    return this.keyMap[key];
  }

  sync(snapshot: MetadataSnapshot): MetadataChange[] {
    const changes: MetadataChange[] = [];

    for (const hashKey in snapshot.hashMap) {
      const origin = snapshot.hashMap[hashKey];
      if (!origin) continue;

      let entity = this.hashMap[hashKey];
      if (entity != null) {
        // reuse original store names and continue
        entity.sync(origin);
        continue;
      }

      // we currently don't have an existing state instance for this hash, so
      // either the use updated the state without keeping reference to the old
      // version or the state was simply deleted.

      entity = this.keyMap[origin.name];
      const deleted = origin.clone();

      if (entity != null) {
        // we found another state with the same name, so the old state was
        // probably renamed. we'll rename the old state to the new name and keep
        // the old state around for backward compatibility.

        if (entity.matches(origin)) {
          entity.sync(origin);

          this.hashMap[hashKey] = entity;
          changes.push({ type: 'updated', entity, origin });
        }

        deleted.name = `${entity.name}_old`;

        for (let i = 2; this.keyMap[deleted.name] != null; i += 1) {
          deleted.name = `${entity.name}_old${i}`;
        }
      }

      this.hashMap[hashKey] = deleted;
    }

    // search for new states that were added to the codebase since the last
    // snapshot was taken.

    for (const hashKey in this.hashMap) {
      const entity = this.hashMap[hashKey];
      if (!entity) continue;

      const origin = snapshot.hashMap[hashKey];
      if (origin) continue;

      changes.push({ type: 'created', entity });
    }

    return changes;
  }
}
