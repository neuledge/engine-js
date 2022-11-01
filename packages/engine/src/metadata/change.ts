import { MetadataEntity } from './entity.js';

export type MetadataChange =
  | MetadataCreatedChange
  | MetadataUpdatedChange
  | MetadataDeletedChange;

export interface MetadataCreatedChange {
  type: 'created';
  entity: MetadataEntity;
}

export interface MetadataUpdatedChange {
  type: 'renamed' | 'updated';
  origin: MetadataEntity;
  entity: MetadataEntity;
}

export interface MetadataDeletedChange {
  type: 'deleted';
  origin: MetadataEntity;
}
