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
  private collectionMap: Partial<Record<string, MetadataCollection>>;

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
    this.collectionMap = {};

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (this.keyMap[entity.key] == null) {
        this.keyMap[entity.key] = entity;
      }

      const collection =
        this.collectionMap[entity.collectionName] ??
        (this.collectionMap[entity.collectionName] = {
          name: entity.collectionName,
          states: [],
        });

      collection.states.push(entity);
    }
  }

  getCollections(states: State[]): MetadataCollection[] {
    return [
      ...new Set(
        states
          .map((item) => this.collectionMap[item.$key])
          .filter((item): item is MetadataCollection => !!item),
      ),
    ];
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

    this.collectionMap = {};

    for (const hashKey in this.hashMap) {
      const entity = this.hashMap[hashKey];
      if (!entity) continue;

      const collection =
        this.collectionMap[entity.collectionName] ??
        (this.collectionMap[entity.collectionName] = {
          name: entity.collectionName,
          states: [],
        });

      collection.states.push(entity);

      const origin = prev.hashMap[hashKey];
      if (origin) continue;

      changes.push({ type: 'created', entity });
    }

    return changes;
  }

  serialize(): MetadataState[] {
    return Object.values(this.hashMap)
      .filter((item): item is MetadataState => !!item)
      .map((item) => serializeMetadataState(item));
  }
}
