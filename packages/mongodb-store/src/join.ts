import {
  getStoreScalarValueKey,
  isStoreScalarValueEqual,
  StoreCollection,
  StoreDocument,
  StoreError,
  StoreFindOptions,
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
  project?: Document | null;
  find: Filter<Document>;
  limit: number;
}

type StoreDocumentReference = {
  doc: StoreDocument;
  removed?: boolean;
};

type QueryJoinFn = (
  query: JoinQuery,
  signal: AbortSignal,
) => Promise<StoreDocument[]>;

export const applyJoins = async (
  options: Pick<StoreFindOptions, 'innerJoin' | 'leftJoin'>,
  docs: StoreDocument[],
  queryJoin: QueryJoinFn,
): Promise<StoreDocument[]> => {
  if (!docs.length) return docs;

  const { innerJoin, leftJoin } = options;
  if (!innerJoin && !leftJoin) return docs;

  const refs = docs.map(
    (doc): StoreDocumentReference => ({
      doc: { ...doc },
    }),
  );

  await Promise.all([
    getJoinDocs(innerJoin ?? {}, refs, queryJoin, true),
    getJoinDocs(leftJoin ?? {}, refs, queryJoin, false),
  ]);

  return refs.filter((ref) => !ref.removed).map((ref) => ref.doc);
};

const getJoinDocs = async (
  join: StoreJoin,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  required: boolean,
): Promise<void> => {
  await Promise.all(
    Object.entries(join).map(async ([key, options]) => [
      key,
      await applyJoinOptions(options, key, refs, queryJoin, required),
    ]),
  );
};

const applyJoinOptions = async (
  options: StoreJoinOptions[],
  key: string,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  required: boolean,
): Promise<void> => {
  const left = new Set(refs);
  const abort = new AbortController();

  await Promise.all(
    options.map(async (option) => {
      const res = await queryJoinEntries(option, refs, queryJoin, abort.signal);
      if (abort.signal.aborted) return;

      for (const [j, ref] of refs.entries()) {
        const entry = res[j];
        if (!entry) continue;

        if (option.select && ref.doc[key] == null) {
          ref.doc[key] = entry;
        }
        left.delete(ref);
      }

      if (!left.size) abort.abort();
    }),
  ).catch((error) => {
    if (abort.signal.aborted) return;

    throw error;
  });

  if (required && left.size) {
    for (const ref of left) {
      ref.removed = true;
    }
  }
};

const queryJoinEntries = async (
  option: StoreJoinOptions,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  signal: AbortSignal,
): Promise<(StoreDocument | undefined)[]> => {
  const { find, limit } = joinByFilter(option.by, refs);

  const query = getJoinQuery(option, find, limit);
  let docs = await queryJoin(query, signal);

  if (signal.aborted) {
    throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
  }

  // handle recursive joins
  docs = await applyJoins(option, docs, queryJoin);

  if (signal.aborted) {
    throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
  }

  const docMap = getDocumentMap(option.by, docs);

  return refs.map((ref) =>
    docMap.get(getDocumentKey(option.by, ref.doc, true)),
  );
};

const getJoinQuery = (
  options: StoreJoinOptions,
  find: JoinQuery['find'],
  limit: JoinQuery['limit'],
): JoinQuery => {
  let project: Document | null = Object.fromEntries(
    Object.keys(options.by).map((key) => [escapeFieldName(key), 1]),
  );

  if (options.select) {
    project =
      typeof options.select === 'object'
        ? { ...projectFilter(options.select), ...project }
        : null;
  }

  return {
    options,
    collection: options.collection,
    project,
    find: options.where ? { $and: [find, findFilter(options.where)] } : find,
    limit,
  };
};

/**
 * Return a filter to find all the related documents using the `by` option.
 *
 * Assume `refs.length > 1`.
 */
const joinByFilter = (
  by: StoreJoinBy,
  refs: StoreDocumentReference[],
): Pick<JoinQuery, 'find' | 'limit'> => {
  const { find, filters } = parseJoinByDocuments(by, refs);

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
      $or: refs.map((ref, i) => ({
        ...find,
        ...Object.fromEntries(
          filters.map(([key, values]) => [
            escapeFieldName(key),
            { $eq: escapeValue(values[i]) },
          ]),
        ),
      })),
    },
    limit: refs.length,
  };
};

/**
 * Break down the `by` option into a common find filter and specific filters for
 * each document value.
 *
 * Assume `refs.length > 1`.
 */
const parseJoinByDocuments = (
  by: StoreJoinBy,
  refs: StoreDocumentReference[],
) => {
  const find: Filter<Document> = {};
  const filters: [key: string, values: (StoreScalarValue | undefined)[]][] = [];

  for (const [key, value] of Object.entries(by)) {
    if (value.field == null) {
      find[escapeFieldName(key)] = { $eq: escapeValue(value.value) };
      continue;
    }

    const values = refs.map((ref) => ref.doc[value.field]);

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
