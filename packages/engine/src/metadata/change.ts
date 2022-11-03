import { MetadataState } from './state.js';

export type MetadataChange =
  | MetadataCreatedChange
  | MetadataUpdatedChange
  | MetadataDeletedChange;

export interface MetadataCreatedChange {
  type: 'created';
  entity: MetadataState;
}

export interface MetadataUpdatedChange {
  type: 'renamed' | 'updated';
  origin: MetadataState;
  entity: MetadataState;
}

export interface MetadataDeletedChange {
  type: 'deleted';
  origin: MetadataState;
}
