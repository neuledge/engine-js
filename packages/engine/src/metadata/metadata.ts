import { stateDefinitions } from '@/generated/index.js';
import {
  isEntityMatches,
  MetadataEntity,
  serializeMetadataEntity,
} from './entity.js';
import { toMetadataState } from './state.js';

export class Metadata {
  public readonly hashMap: Partial<
    Record<MetadataEntity['hash'], MetadataEntity>
  >;
  public readonly keyMap: Partial<
    Record<MetadataEntity['key'], MetadataEntity>
  >;

  static generate(): Metadata {
    return new this(
      [...stateDefinitions.values()].map((item) => toMetadataState(item)),
    );
  }

  constructor(entities: MetadataEntity[]) {
    this.hashMap = {};
    this.keyMap = {};

    for (const entity of entities) {
      this.hashMap[entity.hash] = entity;
      this.keyMap[entity.key] = entity;
    }
  }

  sync(other: Metadata): this {
    for (const hash in other.hashMap) {
      if (this.hashMap[hash]) continue;

      const otherEntity = other.hashMap[hash];
      if (!otherEntity) continue;

      const entity = this.keyMap[otherEntity.key];
      if (entity != null && isEntityMatches(otherEntity, entity)) {
        this.hashMap[hash] = entity;
        continue;
      }

      if (!otherEntity.origin) {
        throw new ReferenceError(
          `Can't find entity definition for '${otherEntity.key}'`,
        );
      }

      this.hashMap[hash] = otherEntity;
    }

    return this;
  }

  serialize(): MetadataEntity[] {
    return Object.values(this.hashMap)
      .filter((item): item is MetadataEntity => !!item)
      .map((item) => serializeMetadataEntity(item));
  }
}
