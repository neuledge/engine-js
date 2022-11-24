import { Scalar } from '@neuledge/scalars';
import { StateDefinition } from '@/definitions/index.js';
import { MetadataChange } from './change.js';
import { MetadataCollection } from './collection.js';
import { assignMetadataNames } from './names/index.js';
import { MetadataState, MetadataGhostState } from './state/index.js';

const HASH_KEY_ENCODING = 'base64url';

export class Metadata {
  private readonly typeMap: Partial<Record<string, Scalar>>;
  private readonly hashMap: Partial<Record<string, MetadataGhostState>>;
  private readonly keyMap: Partial<Record<string, MetadataState>>;

  static generate(states: Iterable<StateDefinition>): Metadata {
    const ctx = {};

    return new this(
      assignMetadataNames(
        [...states].map((state) => MetadataState.fromDefinition(ctx, state)),
      ),
    );
  }

  constructor(states: MetadataGhostState[]) {
    this.typeMap = {};
    this.hashMap = {};
    this.keyMap = {};

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (entity.instance && this.keyMap[entity.instance.$name] == null) {
        this.keyMap[entity.instance.$name] = entity as MetadataState;
      }

      for (const { type } of entity.fields) {
        if (this.typeMap[type.key] == null) {
          this.typeMap[type.key] = type;
        }
      }
    }
  }

  findType(key: string): Scalar | undefined {
    return this.typeMap[key];
  }

  findStateByKey(key: string): MetadataState | undefined {
    return this.keyMap[key];
  }

  findStateByHash(hash: Buffer): MetadataGhostState | undefined {
    return this.hashMap[hash.toString(HASH_KEY_ENCODING)];
  }

  getCollections(states: StateDefinition[]): MetadataCollection[] {
    const collections = new Map<
      MetadataCollection['name'],
      MetadataCollection
    >();

    for (const state of states) {
      const entity = this.keyMap[state.$name];
      if (!entity) continue;

      let collection = collections.get(entity.collectionName);
      if (!collection) {
        collection = new MetadataCollection(entity.collectionName, []);
        collections.set(entity.collectionName, collection);
      }

      collection.states.push(entity);
    }

    return [...collections.values()];
  }

  sync(prev: Metadata): MetadataChange[] {
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
