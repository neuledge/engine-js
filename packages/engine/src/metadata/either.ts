import { Either } from '@/index.js';
import { MetadataEntityHash } from './entity.js';
import { generateHash } from './hash.js';
import {
  isMetadataStatesEquals,
  MetadataState,
  serializeMetadataState,
  toMetadataState,
} from './state.js';

export interface MetadataEither extends Array<MetadataState> {
  key: string;
  hash: MetadataEntityHash;
  origin?: Either;
}

export const toMetadataEither = (either: Either): MetadataEither => {
  const states = either.map((item) => toMetadataState(item));

  return Object.assign(states, {
    key: either.$key,
    hash: generateEitherHash(states),
    origin: either,
  });
};

export const isMetadataEithersEquals = (
  a: MetadataEither,
  b: MetadataEither,
): boolean =>
  a.key === b.key &&
  a.hash.equals(b.hash) &&
  a.length === b.length &&
  a.every((item, i) => isMetadataStatesEquals(item, b[i]));

export const serializeMetadataEither = (
  either: MetadataEither,
): MetadataEither =>
  Object.assign(
    either.map((item) => serializeMetadataState(item)),
    {
      key: either.key,
      hash: either.hash,
    },
  );

const generateEitherHash = (states: MetadataState[]): MetadataEntityHash =>
  generateHash(states.map((item) => item.hash).sort((a, b) => a.compare(b)));
