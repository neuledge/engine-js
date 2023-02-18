import { StoreJoin, StoreJoinBy, StoreJoinChoice } from '@neuledge/store';
import {
  Metadata,
  MetadataCollection,
  MetadataState,
  MetadataStateField,
} from '@/metadata';
import { NeuledgeError } from '@/error';
import {
  resolveDefer,
  StateDefinition,
  StateDefinitionRelation,
} from '@/definitions';

interface RelationOptions<T extends { states?: StateDefinition[] | null }> {
  collection: MetadataCollection;
  by: StoreJoinBy;
  query: T;
}

/**
 * Convert relation query options to store join options.
 * This function designed to be used with query match, populate, expand, etc.
 */
export const convertRelationQueryOptions = <
  T extends { [key in string]?: { states?: StateDefinition[] | null } },
  R extends StoreJoinChoice,
>(
  metadata: Metadata,
  collection: MetadataCollection,
  relationQueries: T,
  convert: (relation: RelationOptions<NonNullable<T[keyof T]>>) => R,
): StoreJoin<R> => {
  const res: Record<string, R[]> = {};

  // resolve all the states relations defer for later use
  const statesRelations = collection.states.map((state) =>
    resolveDefer(state.instance.$relations, {}),
  );

  for (const key in relationQueries) {
    const query = relationQueries[key];
    if (query == null) continue;

    const referenceCollectionMap = getRelationReferenceCollections(
      metadata,
      collection.states,
      statesRelations.map(
        (stateRelations) => stateRelations[key] ?? { states: [] },
      ),
      key,
      query.states,
    );

    const values: R[] = [];

    for (const [reference, collectionMap] of referenceCollectionMap) {
      for (const [targerCollection, refCollections] of collectionMap) {
        const fields = targerCollection.getSchemaFields(reference);

        values.push(
          ...refCollections.map((relCollection) => {
            const reverse = relCollection === collection;

            return convert({
              collection: reverse ? targerCollection : relCollection,
              by: getStoreJoinBy(reference, fields, relCollection, reverse),
              query,
            });
          }),
        );
      }
    }

    res[key] = values;
  }

  return res;
};

/**
 * Get relation reference collections.
 * For each reference field, it gets the source collection and all the other
 * collections that was referenced by this field. For example, if we have an
 * entity `Post` with the field `post.user`, then the result will be:
 *
 * ```ts
 * {
 *  'user': {
 *   [PostsCollection]: [UsersCollection]
 * }
 * ```
 *
 * The same result will apply for the reverse relation. Ie, if we have an
 * entity `User` with the field `user.posts`, then the result will be the same,
 * as the relation stored in the `post.user` field.
 */
const getRelationReferenceCollections = (
  metadata: Metadata,
  states: MetadataState[],
  stateRelations: StateDefinitionRelation[],
  key: string,
  queryStates?: StateDefinition[] | null,
): Map<string, Map<MetadataCollection, MetadataCollection[]>> => {
  const res = new Map<string, Map<MetadataCollection, MetadataCollection[]>>();

  for (const [i, state] of states.entries()) {
    const stateRelation = stateRelations[i];
    if (!stateRelation.states.length) continue;

    const path = stateRelation.reference ?? key;

    let entry = res.get(path);
    if (!entry) {
      entry = new Map();
      res.set(path, entry);
    }

    let relStates;
    if (queryStates) {
      const queryStatesMap = new Map(
        queryStates.map((state) => [state.$name, state]),
      );

      relStates = stateRelation.states.filter(
        (state) => queryStatesMap.get(state.$name) === state,
      );

      if (relStates.length !== queryStates.length) {
        throw new NeuledgeError(
          NeuledgeError.Code.RELATION_STATE_NOT_FOUND,
          `Could not find matching states for '${key}': ${queryStates
            .map((state) => state.$name)
            .join(', ')}`,
        );
      }
    } else {
      relStates = stateRelation.states;
    }

    let collections = [metadata.getCollectionByMetadataState(state)];
    let relCollections = metadata.getCollections(relStates);

    if (stateRelation.reference) {
      [collections, relCollections] = [relCollections, collections];
    }

    for (const collection of collections) {
      entry.set(collection, relCollections);
    }
  }

  return res;
};

/**
 * Get store join by object from relation fields.
 * Receives the relation key and all the fields that are part of the relation in
 * the current collection. Then it tries to find the matching fields in the
 * related collection. If it fails, it throws an error.
 */
const getStoreJoinBy = (
  reference: string,
  fields: MetadataStateField[],
  relCollection: MetadataCollection,
  reverse: boolean,
): StoreJoinBy => {
  const res: StoreJoinBy = {};

  const fieldMap = new Map(
    fields.map((field) => [field.path.slice(reference.length + 1), field]),
  );

  for (const state of relCollection.states) {
    for (const refField of state.fields) {
      const field = fieldMap.get(refField.path);
      if (!field) continue;

      if (reverse) {
        res[field.name] = { field: refField.name };
      } else {
        res[refField.name] = { field: field.name };
      }

      fieldMap.delete(refField.path);

      if (!fieldMap.size) {
        return res;
      }
    }
  }

  throw new NeuledgeError(
    NeuledgeError.Code.RELATION_FIELD_NOT_FOUND,
    `Could not find matching fields for '${reference}': ${[
      ...fieldMap.keys(),
    ].join(', ')}`,
  );
};
