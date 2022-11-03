import { MetadataLiveState } from './state.js';

export interface MetadataCollection {
  name: string;
  states: MetadataLiveState[];
}
