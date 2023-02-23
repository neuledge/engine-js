import { StateSnapshot } from './state';

export type MetadataChange = MetadataCreatedChange | MetadataUpdatedChange;

export interface MetadataCreatedChange {
  type: 'created';
  entity: StateSnapshot;
}

export interface MetadataUpdatedChange {
  type: 'updated';
  entity: StateSnapshot;
  origin: StateSnapshot;
}
