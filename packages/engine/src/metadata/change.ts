import { MetadataGhostState } from './state';

export type MetadataChange =
  | MetadataCreatedChange
  | MetadataUpdatedChange
  | MetadataDeletedChange;

export interface MetadataCreatedChange {
  type: 'created';
  entity: MetadataGhostState;
}

export interface MetadataUpdatedChange {
  type: 'updated';
  origin: MetadataGhostState;
  entity: MetadataGhostState;
}

export interface MetadataDeletedChange {
  type: 'deleted';
  origin: MetadataGhostState;
}
