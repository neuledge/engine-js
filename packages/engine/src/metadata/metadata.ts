import { stateDefinitions } from '@/generated/index.js';
import { MetadataChange } from './change.js';
import {
  isEntityMatches,
  isMetadataEntitiesEquals,
  MetadataEntity,
  serializeMetadataEntity,
} from './entity.js';
import { toMetadataState } from './state.js';

const HASH_KEY_ENCODING = 'base64url';

export class Metadata {
  public readonly hashMap: Partial<Record<string, MetadataEntity>>;
  public readonly keyMap: Partial<Record<string, MetadataEntity>>;
  public readonly changes: MetadataChange[];

  static generate(): Metadata {
    return new this(
      [...stateDefinitions.values()].map((item) => toMetadataState(item)),
    );
  }

  constructor(entities: MetadataEntity[]) {
    this.hashMap = {};
    this.keyMap = {};
    this.changes = [];

    for (const entity of entities) {
      this.hashMap[entity.hash.toString(HASH_KEY_ENCODING)] = entity;

      if (this.keyMap[entity.key] == null) {
        this.keyMap[entity.key] = entity;
      }
    }
  }

  sync(other: Metadata): this {
    for (const hashKey in other.hashMap) {
      const origin = other.hashMap[hashKey];
      if (!origin) continue;

      let entity = this.hashMap[hashKey];
      if (entity) {
        if (!isMetadataEntitiesEquals(entity, origin)) {
          this.changes.push({ type: 'renamed', origin, entity });
        }
        continue;
      }

      entity = this.keyMap[origin.key];
      if (entity != null && isEntityMatches(origin, entity)) {
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

  serialize(): MetadataEntity[] {
    return Object.values(this.hashMap)
      .filter((item): item is MetadataEntity => !!item)
      .map((item) => serializeMetadataEntity(item));
  }
}
