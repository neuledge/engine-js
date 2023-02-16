import {
  getStoreScalarValueKey,
  isStoreScalarValueEqual,
  StoreCollection,
  StoreDocument,
  StoreError,
  uniqueStoreScalarValues,
} from '@neuledge/store';
import {
  StoreJoin,
  StoreJoinBy,
  StoreJoinOptions,
  StoreScalarValue,
} from '@neuledge/store';
import { Document, Filter } from 'mongodb';
import { escapeFieldName } from './fields';
import { findFilter } from './filter';
import { projectFilter } from './project';
import { escapeValue } from './values';

export interface JoinQuery {
  options: StoreJoinOptions;
  collection: StoreCollection;
  returns: boolean;
  project?: Document | null;
  find: Filter<Document>;
  limit: number;
}

export const getJoinQueries = (
  join: StoreJoin,
  docs: StoreDocument[],
): Record<string, JoinQuery[]> =>
  Object.fromEntries(
    Object.entries(join).map(([key, queries]) => [
      key,
      queries.map((query) => getJoinQuery(query, docs)),
    ]),
  );

export const applyJoinQuery = (
  docs: StoreDocument[],
  key: string,
  joinByQueries: StoreJoinBy[],
  joinDocs: StoreDocument[][],
  required?: boolean,
): StoreDocument[] => {
  const res: StoreDocument[] = [];

  const joinDocMap: Map<unknown, StoreDocument>[] = [];

  for (const [i, by] of joinByQueries.entries()) {
    joinDocMap.push(getDocumentMap(by, joinDocs[i]));
  }

  for (const doc of docs) {
    let joinDoc;
    for (const [i, by] of joinByQueries.entries()) {
      joinDoc = joinDocMap[i].get(getDocumentKey(by, doc, true));
      if (joinDoc) break;
    }

    if (joinDoc) {
      res.push({
        ...doc,
        [key]: joinDoc,
      });
    } else if (!required) {
      res.push(doc);
    }
  }

  return res;
};

const getJoinQuery = (
  options: StoreJoinOptions,
  docs: StoreDocument[],
): JoinQuery => {
  let returns;
  let project: Document | null = Object.fromEntries(
    Object.keys(options.by).map((key) => [escapeFieldName(key), 1]),
  );

  if (options.select) {
    returns = true;
    project =
      typeof options.select === 'object'
        ? { ...projectFilter(options.select), ...project }
        : null;
  } else {
    returns = false;
  }

  if (options.innerJoin || options.leftJoin) {
    // FIXME support recursive joins

    throw new StoreError(
      StoreError.Code.NOT_IMPLEMENTED,
      'Recursive joins are not implemented yet',
    );
  }

  const { find, limit } = joinByFilter(options.by, docs);

  return {
    options,
    collection: options.collection,
    returns,
    project,
    find: options.where ? { $and: [find, findFilter(options.where)] } : find,
    limit,
  };
};

/**
 * Return a filter to find all the related documents using the `by` option.
 */
const joinByFilter = (
  by: StoreJoinBy,
  docs: StoreDocument[],
): Pick<JoinQuery, 'find' | 'limit'> => {
  const { find, filters } = parseJoinByDocuments(by, docs);

  if (filters.length === 1) {
    const [key, values] = filters[0];

    const uniqueValues = uniqueStoreScalarValues(values);
    find[escapeFieldName(key)] = {
      $in: uniqueValues.map((v) => escapeValue(v)),
    };

    return { find, limit: uniqueValues.length };
  }

  if (!filters.length) {
    return { find, limit: 1 };
  }

  return {
    find: {
      $or: docs.map((doc, i) => ({
        ...find,
        ...Object.fromEntries(
          filters.map(([key, values]) => [
            escapeFieldName(key),
            { $eq: escapeValue(values[i]) },
          ]),
        ),
      })),
    },
    limit: docs.length,
  };
};

/**
 * Break down the `by` option into a common find filter and specific filters for
 * each document value.
 */
const parseJoinByDocuments = (by: StoreJoinBy, docs: StoreDocument[]) => {
  if (!docs.length) {
    throw new StoreError(
      StoreError.Code.INTERNAL_ERROR,
      'Cannot join documents without any document',
    );
  }

  const find: Filter<Document> = {};
  const filters: [key: string, values: (StoreScalarValue | undefined)[]][] = [];

  for (const [key, value] of Object.entries(by)) {
    if (value.field == null) {
      find[escapeFieldName(key)] = { $eq: escapeValue(value.value) };
      continue;
    }

    const values = docs.map((doc) => doc[value.field]);

    if (
      values.length > 1 &&
      !values.every((v) => isStoreScalarValueEqual(v, values[0]))
    ) {
      filters.push([key, values]);
      continue;
    }

    find[escapeFieldName(key)] = { $eq: escapeValue(values[0]) };
  }

  return { find, filters };
};

const getDocumentMap = (
  by: StoreJoinBy,
  docs: StoreDocument[],
  ref?: boolean,
): Map<unknown, StoreDocument> =>
  new Map(docs.map((doc) => [getDocumentKey(by, doc, ref), doc]));

const getDocumentKey = (by: StoreJoinBy, doc: StoreDocument, ref?: boolean) => {
  const key = Object.fromEntries(
    Object.entries(by).map(([key, value]) => [
      key,
      value.field != null ? doc[ref ? value.field : key] : value.value,
    ]),
  );

  return getStoreScalarValueKey(key);
};
