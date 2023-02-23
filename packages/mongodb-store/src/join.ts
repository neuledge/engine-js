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
  StoreJoinChoice,
  StoreScalarValue,
} from '@neuledge/store';
import { Document, Filter } from 'mongodb';
import { escapeFieldName } from './fields';
import { findFilter } from './filter';
import { projectFilter } from './project';
import { escapeValue } from './values';

export interface JoinQuery {
  choice: StoreJoinChoice;
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

export const applyJoinOptions = async (
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
    applyJoinKeys(innerJoin ?? {}, refs, queryJoin, true),
    applyJoinKeys(leftJoin ?? {}, refs, queryJoin, false),
  ]);

  return refs.filter((ref) => !ref.removed).map((ref) => ref.doc);
};

const applyJoinKeys = async (
  join: StoreJoin,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  required: boolean,
): Promise<void> => {
  await Promise.all(
    Object.entries(join).map(async ([key, options]) => [
      key,
      await applyJoin(options, key, refs, queryJoin, required),
    ]),
  );
};

const applyJoin = async (
  choices: StoreJoinChoice[],
  key: string,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  required: boolean,
): Promise<void> => {
  const left = new Set(refs);
  const abort = new AbortController();

  const handleChoices = Promise.all(
    choices.map(async (option) => {
      const res = await queryJoinChoice(option, refs, queryJoin, abort.signal);
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
  );

  await new Promise((resolve, reject) => {
    handleChoices.then(resolve, (error) => {
      // prevent race condition
      if (abort.signal.aborted) return;

      reject(error);
      abort.abort();
    });

    abort.signal.addEventListener('abort', resolve);
  });

  if (required && left.size) {
    for (const ref of left) {
      ref.removed = true;
    }
  }
};

const queryJoinChoice = async (
  choice: StoreJoinChoice,
  refs: StoreDocumentReference[],
  queryJoin: QueryJoinFn,
  signal: AbortSignal,
): Promise<(StoreDocument | undefined)[]> => {
  const { find, limit } = joinByFilter(choice, refs);

  if (!limit) {
    return [];
  }

  const query = getJoinQuery(choice, find, limit);
  let docs = await queryJoin(query, signal);

  if (signal.aborted) {
    throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
  }

  // handle recursive joins
  docs = await applyJoinOptions(choice, docs, queryJoin);

  if (signal.aborted) {
    throw new StoreError(StoreError.Code.ABORTED, 'Aborted');
  }

  const docMap = getDocumentMap(choice.by, docs);

  return refs.map((ref) =>
    docMap.get(getDocumentKey(choice.by, ref.doc, true)),
  );
};

const getJoinQuery = (
  choice: StoreJoinChoice,
  find: JoinQuery['find'],
  limit: JoinQuery['limit'],
): JoinQuery => {
  let project: Document | null = projectFilter(
    choice.collection.primaryKey,
    Object.fromEntries(Object.keys(choice.by).map((key) => [key, true])),
  );

  if (choice.select) {
    project =
      typeof choice.select === 'object'
        ? {
            ...projectFilter(choice.collection.primaryKey, choice.select),
            ...project,
          }
        : null;
  }

  return {
    choice: choice,
    collection: choice.collection,
    project,
    find: choice.where
      ? { $and: [find, findFilter(choice.collection.primaryKey, choice.where)] }
      : find,
    limit,
  };
};

/**
 * Return a filter to find all the related documents using the `by` option.
 *
 * Assume `refs.length > 1`.
 */
const joinByFilter = (
  choice: StoreJoinChoice,
  refs: StoreDocumentReference[],
): Pick<JoinQuery, 'find' | 'limit'> => {
  const { find, filters } = parseJoinByDocuments(choice, refs);

  if (filters.length === 1) {
    const [key, values] = filters[0];

    const uniqueValues = uniqueStoreScalarValues(
      values.filter((v) => v != null),
    );
    find[key] = {
      $in: uniqueValues.map((v) => escapeValue(v)),
    };

    return { find, limit: uniqueValues.length };
  }

  if (!filters.length) {
    return { find, limit: 1 };
  }

  const $or: Filter<Document>[] = [];

  for (let i = 0; i < refs.length; i += 1) {
    const or: Filter<Document> = { ...find };
    let skip = false;

    for (const [key, values] of filters) {
      const value = values[i];

      if (value == null) {
        skip = true;
        continue;
      }

      or[key] = { $eq: escapeValue(value) };
    }

    if (skip) continue;
    $or.push(or);
  }

  return {
    find: { $or },
    limit: $or.length,
  };
};

/**
 * Break down the `by` option into a common find filter and specific filters for
 * each document value.
 *
 * Assume `refs.length >= 1`.
 */
const parseJoinByDocuments = (
  { collection, by }: StoreJoinChoice,
  refs: StoreDocumentReference[],
) => {
  const find: Filter<Document> = {};
  const filters: [key: string, values: (StoreScalarValue | undefined)[]][] = [];

  for (const [name, value] of Object.entries(by)) {
    const key = escapeFieldName(collection.primaryKey, name);

    if (value.field == null) {
      find[key] = { $eq: escapeValue(value.value) };
      continue;
    }

    const values = refs.map((ref) => ref.doc[value.field]);
    const existValues = values.filter((v) => v != null);

    if (
      existValues.length >= 1 &&
      existValues.every((v) => isStoreScalarValueEqual(v, existValues[0]))
    ) {
      find[key] = { $eq: escapeValue(existValues[0]) };
      continue;
    }

    filters.push([key, values]);
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
