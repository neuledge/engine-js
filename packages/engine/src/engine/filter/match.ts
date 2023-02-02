import { resolveDefer, StateDefinition } from '@/definitions';
import { NeuledgeError } from '@/error';
import { Metadata, MetadataCollection, MetadataStateField } from '@/metadata';
import { Match, MatchQueryOptions } from '@/queries';
import {
  StoreFindOptions,
  StoreMatch,
  StoreMatchBy,
  StoreMatchOptions,
} from '@neuledge/store';
import { convertFilterQuery } from './filter';

export const convertMatchQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match }: MatchQueryOptions<S>,
): Pick<StoreFindOptions, 'match'> => ({
  ...(match != null
    ? { match: convertMatch(metadata, collection, match) }
    : null),
});

const convertMatch = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: Match<S>,
): StoreMatch => {
  const res: StoreMatch = {};

  const relations = collection.states.map((state) =>
    resolveDefer(state.instance.$relations, {}),
  );

  for (const key in match) {
    const filterOptions = match[key];
    if (filterOptions == null) continue;

    const fields = collection.getFields(key);
    if (!fields.length) continue;

    const states =
      filterOptions.states ??
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
        collection: relCollection,
        by: getStoreMatchBy(key, fields, relCollection),
        ...convertFilterQuery(
          metadata,
          relCollection.states,
          relCollection,
          filterOptions,
        ),
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

      res[field.name] = { field: refField.name };
      fieldMap.delete(refField.path);

      if (!fieldMap.size) {
        return res;
      }
    }
  }

  throw new NeuledgeError(
    NeuledgeError.Code.RELATION_FIELD_NOT_FOUND,
    `Could not find matching fields for '${key}': ${[...fieldMap.keys()].join(
      ', ',
    )}`,
  );
};
