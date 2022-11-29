import { resolveDefer, StateDefinition } from '@/definitions/index.js';
import {
  Metadata,
  MetadataCollection,
  MetadataStateField,
} from '@/metadata/index.js';
import { Match } from '@/queries/index.js';
import { StoreMatch, StoreMatchBy, StoreMatchOptions } from '@/store/index.js';
import { convertFilterQuery } from './index.js';

export const convertMatch = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: Match<S>,
): StoreMatch => {
  const res: StoreMatch = {};

  const relations = collection.states.map((state) =>
    resolveDefer(state.instance.$relations, {}),
  );

  for (const key in match) {
    const matchOpts = match[key];
    if (matchOpts == null) continue;

    const fields = collection.getFields(key);
    if (!fields.length) continue;

    const states =
      matchOpts.states ??
      relations.flatMap((relation): readonly StateDefinition[] => {
        const entry = relation[key];
        if (!entry) return [];

        if (Array.isArray(entry[0])) {
          return entry[0];
        }

        return entry as readonly StateDefinition[];
      });

    res[key] = metadata.getCollections(states).map(
      (relCollection): StoreMatchOptions => ({
        collectionName: relCollection.name,
        by: getStoreMatchBy(key, fields, relCollection),
        ...convertFilterQuery(metadata, relCollection, matchOpts),
      }),
    );
  }

  return res;
};

const getStoreMatchBy = (
  key: string,
  fields: MetadataStateField[],
  relCollection: MetadataCollection,
): StoreMatchBy => {
  const res: StoreMatchBy = {};

  const fieldMap = new Map(
    fields.map((field) => [field.path.slice(key.length + 1), field]),
  );

  for (const state of relCollection.states) {
    for (const refField of state.fields) {
      const field = fieldMap.get(refField.path);
      if (!field) continue;

      res[field.name] = refField.name;
      fieldMap.delete(refField.path);

      if (!fieldMap.size) {
        return res;
      }
    }
  }

  throw new Error(
    `Could not find matching fields for '${key}': ${[...fieldMap.keys()].join(
      ', ',
    )}`,
  );
};
