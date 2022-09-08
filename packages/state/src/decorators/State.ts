import { createDecorator, getClassMetadata } from './utils.js';

const metadataKey = Symbol('State');

export interface StateMetadata {
  index: number;
}

export const State = (index: number) =>
  createDecorator<StateMetadata>(metadataKey, { index });

export const getStateMetadata = getClassMetadata<StateMetadata>(metadataKey);
