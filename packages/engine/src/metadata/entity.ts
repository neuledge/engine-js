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
  origin: MetadataEntity | MetadataState[],
  target: MetadataEntity | MetadataState[],
): boolean => {
  if (Array.isArray(origin)) {
    return origin.every((item) => isStateMatches(item, target));
  }

  return isStateMatches(origin, target);
};

const isStateMatches = (
  origin: MetadataState,
  target: MetadataEntity | MetadataState[],
): boolean => {
  if (Array.isArray(target)) {
    return target.some((item) => isStatesMatches(origin, item));
  }

  return isStatesMatches(origin, target);
};

const isStatesMatches = (
  origin: MetadataState,
  target: MetadataState,
): boolean =>
  Object.entries(origin.fields).every(([key, { type, nullable }]) => {
    if (nullable) return true;

    const targetField = target.fields[key];
    if (targetField.nullable) return false;

    const targetType = targetField.type;

    if (!Array.isArray(type)) {
      return type === targetType;
    }

    return Array.isArray(targetType) && isEntityMatches(type, targetType);
  });
