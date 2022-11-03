import { State, stateDefinitions } from '@/generated/index.js';
import { MetadataChange } from './change.js';
import { generateStateCollectionNames } from './collections.js';
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
  public readonly hashMap: Partial<Record<string, MetadataState>>;
  public readonly keyMap: Partial<Record<string, MetadataState>>;
  public readonly changes: MetadataChange[];

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
    this.changes = [];

    for (const entity of states) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (this.keyMap[entity.key] == null) {
        this.keyMap[entity.key] = entity;
      }
    }
  }

  getCollectionNames(states: State[]): string[] {
    return [
      ...new Set(
        states
          .map((item) => this.keyMap[item.$key]?.collectionName)
          .filter((item): item is string => !!item),
      ),
    ];
  }

  sync(prev: Metadata): this {
    for (const hashKey in prev.hashMap) {
      const origin = prev.hashMap[hashKey];
      if (!origin) continue;

      let entity = this.hashMap[hashKey];
      if (entity != null) {
        if (!isMetadataStatesEquals(entity, origin)) {
          syncStateCollectionNames(origin, entity);

          this.changes.push({ type: 'renamed', origin, entity });
        }
        continue;
      }

      entity = this.keyMap[origin.key];
      if (entity != null && isStatesMatches(origin, entity)) {
        syncStateCollectionNames(origin, entity);

        this.hashMap[hashKey] = entity;
        this.changes.push({ type: 'updated', origin, entity });
        continue;
      }

      if (!origin.origin) {
        throw new ReferenceError(
          `Can't find previously defined entity '${origin.key}' on the current schema definitions`,
        );
      }

      this.changes.push({ type: 'deleted', origin });
      this.hashMap[hashKey] = origin;
    }

    for (const hashKey in this.hashMap) {
      const entity = this.hashMap[hashKey];
      if (!entity) continue;

      const origin = this.hashMap[hashKey];
      if (origin) continue;

      this.changes.push({ type: 'created', entity });
    }

    return this;
  }

  serialize(): MetadataState[] {
    return Object.values(this.hashMap)
      .filter((item): item is MetadataState => !!item)
      .map((item) => serializeMetadataState(item));
  }
}
