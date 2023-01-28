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

  findType(key: string): Scalar | undefined {
    return this.typeMap[key];
  }

  findStateByHash(hash: Buffer): StateSnapshot | undefined {
    return this.hashMap[hash.toString(HASH_KEY_ENCODING)];
  }

  findStateByKey(key: string): S | undefined {
    return this.keyMap[key];
  }

  sync(prev: MetadataSnapshot): MetadataChange[] {
    const changes: MetadataChange[] = [];

    for (const hashKey in prev.hashMap) {
      const origin = prev.hashMap[hashKey];
      if (!origin) continue;

      let entity = this.hashMap[hashKey];
      if (entity != null) {
        entity.sync(origin);
        continue;
      }

      entity = this.keyMap[origin.name];
      const deleted = origin.clone();

      if (entity != null) {
        if (entity.matches(origin)) {
          entity.sync(origin);

          this.hashMap[hashKey] = entity;
          changes.push({ type: 'updated', origin, entity });
          continue;
        }

        deleted.name = `${entity.name}_old`;

        for (let i = 2; this.keyMap[deleted.name] != null; i += 1) {
          deleted.name = `${entity.name}_old${i}`;
        }
      }

      changes.push({ type: 'deleted', origin: deleted });
      this.hashMap[hashKey] = deleted;
    }

    for (const hashKey in this.hashMap) {
      const entity = this.hashMap[hashKey];
      if (!entity) continue;

      const origin = prev.hashMap[hashKey];
      if (origin) continue;

      changes.push({ type: 'created', entity });
    }

    return changes;
  }
}
