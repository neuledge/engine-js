import { Scalar } from '@neuledge/scalars';
import { State } from '@/generated/index.js';
import { MetadataChange } from './change.js';
import { MetadataCollection } from './collection.js';
import { assignMetadataNames } from './names/index.js';
import {
  isStatesMatches,
  MetadataOriginState,
  MetadataState,
  syncMetadataStates,
  toMetadataState,
} from './state.js';

const HASH_KEY_ENCODING = 'base64url';

export class Metadata {
  private readonly typeMap: Partial<Record<string, Scalar>>;
  private readonly hashMap: Partial<Record<string, MetadataState>>;
  private readonly keyMap: Partial<Record<string, MetadataOriginState>>;

  static generate(states: Iterable<State>): Metadata {
    return new this(
      assignMetadataNames([...states].map((state) => toMetadataState(state))),
    );
  }

  constructor(states: MetadataState[]) {
    this.typeMap = {};
    this.hashMap = {};
    this.keyMap = {};

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (entity.origin && this.keyMap[entity.origin.$key] == null) {
        this.keyMap[entity.origin.$key] = entity as MetadataOriginState;
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

  findStateByKey(key: string): MetadataOriginState | undefined {
    return this.keyMap[key];
  }

  findStateByHash(hash: Buffer): MetadataState | undefined {
    return this.hashMap[hash.toString(HASH_KEY_ENCODING)];
  }

  getCollections(states: State[]): MetadataCollection[] {
    const collections = new Map<
      MetadataCollection['name'],
      MetadataCollection
    >();

    for (const state of states) {
      const entity = this.keyMap[state.$key];
      if (!entity) continue;

      let collection = collections.get(entity.collectionName);
      if (!collection) {
        collection = new MetadataCollection(entity.collectionName, []);
        collections.set(entity.collectionName, collection);
      }

      collection.states.push({ ...entity, origin: state });
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
        syncMetadataStates(origin, entity);
        continue;
      }

      entity = this.keyMap[origin.key];
      const deleted = { ...origin };

      if (entity != null) {
        if (isStatesMatches(origin, entity)) {
          syncMetadataStates(origin, entity);

          this.hashMap[hashKey] = entity;
          changes.push({ type: 'updated', origin, entity });
          continue;
        }

        deleted.key = `${entity.key}_old`;

        for (let i = 2; this.keyMap[deleted.key] != null; i += 1) {
          deleted.key = `${entity.key}_old${i}`;
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
