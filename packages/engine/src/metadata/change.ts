import { StateSnapshot } from './state';

export type MetadataChange =
  | MetadataCreatedChange
  | MetadataUpdatedChange
  | MetadataDeletedChange;

export interface MetadataCreatedChange {
  type: 'created';
  entity: StateSnapshot;
}

export interface MetadataUpdatedChange {
  type: 'updated';
  origin: StateSnapshot;
  entity: StateSnapshot;
}

export interface MetadataDeletedChange {
  type: 'deleted';
  origin: StateSnapshot;
}
