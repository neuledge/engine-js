import { State, stateDefinitions } from '@/generated/index.js';
import { MetadataChange } from './change.js';
import { MetadataCollection } from './collection.js';
import { generateStateCollectionNames } from './names.js';
import {
  isMetadataStatesEquals,
  isStatesMatches,
  MetadataState,
  syncStateCollectionNames,
  serializeMetadataState,
  toMetadataState,
} from './state.js';

const HASH_KEY_ENCODING = 'base64url';

export class Metadata {
  private readonly hashMap: Partial<Record<string, MetadataState>>;
  private readonly keyMap: Partial<Record<string, MetadataState>>;

  static generate(): Metadata {
    const names = generateStateCollectionNames(stateDefinitions.values());

    return new this(
      [...stateDefinitions.values()].map((item) =>
        toMetadataState(names, item),
      ),
    );
  }

  constructor(states: MetadataState[]) {
    this.hashMap = {};
    this.keyMap = {};

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (this.keyMap[entity.key] == null) {
        this.keyMap[entity.key] = entity;
      }
    }
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
        if (!isMetadataStatesEquals(entity, origin)) {
          syncStateCollectionNames(origin, entity);

          changes.push({ type: 'renamed', origin, entity });
        }
        continue;
      }

      entity = this.keyMap[origin.key];
      if (entity != null && isStatesMatches(origin, entity)) {
        syncStateCollectionNames(origin, entity);

        this.hashMap[hashKey] = entity;
        changes.push({ type: 'updated', origin, entity });
        continue;
      }

      if (!origin.origin) {
        throw new ReferenceError(
          `Can't find previously defined entity '${origin.key}' on the current schema definitions`,
        );
      }

      changes.push({ type: 'deleted', origin });
      this.hashMap[hashKey] = origin;
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

  serialize(): MetadataState[] {
    const refs = {};

    return Object.values(this.hashMap)
      .filter((item): item is MetadataState => !!item)
      .map((item) => serializeMetadataState(refs, item));
  }
}
