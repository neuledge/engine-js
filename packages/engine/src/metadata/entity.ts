import { MetadataState, serializeMetadataState } from './state.js';
import { MetadataEither, serializeMetadataEither } from './either.js';

export type MetadataEntity = MetadataState | MetadataEither;
export type MetadataEntityHash = string;

export const serializeMetadataEntity = (
  entity: MetadataEntity,
): MetadataEntity =>
  Array.isArray(entity)
    ? serializeMetadataEither(entity)
    : serializeMetadataState(entity);

export const isEntityMatches = (
  actual: MetadataEntity | MetadataState[],
  target: MetadataEntity | MetadataState[],
): boolean => {
  if (Array.isArray(actual)) {
    return actual.every((item) => isStateMatches(item, target));
  }

  return isStateMatches(actual, target);
};

const isStateMatches = (
  actual: MetadataState,
  target: MetadataEntity | MetadataState[],
): boolean => {
  if (Array.isArray(target)) {
    return target.some((item) => isStatesMatches(actual, item));
  }

  return isStatesMatches(actual, target);
};

const isStatesMatches = (
  actual: MetadataState,
  target: MetadataState,
): boolean =>
  Object.entries(target.fields).every(([key, { type, nullable }]) => {
    const actualField = actual.fields[key];
    if (!actualField) {
      return nullable;
    }

    if (actualField.nullable && !nullable) {
      return false;
    }

    const actualType = actualField.type;

    if (!Array.isArray(type)) {
      return type === actualType;
    }

    return Array.isArray(actualType) && isEntityMatches(actualType, type);
  });
