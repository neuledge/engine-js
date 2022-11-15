import { Scalar } from '@neuledge/scalars';
import {
  resolveDefer,
  State,
  StateWhereRecord,
  StateWhereTerm,
} from '@/generated/index.js';
import {
  Metadata,
  MetadataCollection,
  MetadataOriginStateField,
} from '@/metadata/index.js';
import {
  StoreMatch,
  StoreMatchOptions,
  StoreFindOptions,
  StoreScalarValue,
  StoreWhere,
  StoreWhereRecord,
  StoreWhereValue,
} from '@/store/index.js';
import { Match, FilterQueryOptions, Where } from '@/queries/index.js';
import { getCollectionRelationStates } from './collection.js';

export const convertFilterQuery = <S extends State>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match, where }: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'match' | 'where'> => ({
  ...(where != null ? { where: convertWhere(collection, where) } : null),
  ...(match != null
    ? { match: convertMatch(metadata, collection, match) }
    : null),
});

const convertWhere = <S extends State>(
  collection: MetadataCollection,
  where: Where<S>,
): StoreWhere => {
  const res: StoreWhereRecord[] = [];

  if (where.$or?.length > 0) {
    res.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...where.$or.flatMap((w: StateWhereRecord<any>) =>
        convertWhereRecord(collection, w),
      ),
    );
  } else {
    res.push(...convertWhereRecord(collection, where));
  }

  return res.length === 1 ? res[0] : { $or: res };
};

const convertWhereRecord = (
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateWhereRecord<any>,
): StoreWhereRecord[] => {
  const res: Record<string, StoreWhereRecord> = {};

  const init = {};
  for (const state of collection.states) {
    res[state.key] = init;
  }

  for (const [key, term] of Object.entries(where)) {
    if (term == null) continue;

    const fieldNames = Object.entries(collection.getFieldNameStates(key));
    if (!fieldNames.length) {
      throw new Error(`Unknown field name: '${key}'`);
    }

    for (const [fieldName, states] of fieldNames) {
      const newRecords = new Map();

      for (const state of states) {
        const record = res[state.$key];

        const recordValue = convertWhereTerm(
          resolveDefer(state.$scalars)[key].type,
          term,
        );
        let newRecord = newRecords.get(record);

        if (!newRecord) {
          newRecord = { ...record, [fieldName]: recordValue };
          newRecords.set(record, newRecord);
        }

        res[state.$key] = newRecord;
      }
    }
  }

  return [...new Set(Object.values(res))];
};

const convertWhereTerm = (
  scalar: Scalar,
  term: StateWhereTerm<unknown>,
): StoreWhereValue => {
  const res: Record<string, StoreScalarValue | StoreScalarValue[]> = {};

  for (const [key, value] of Object.entries(term)) {
    switch (key) {
      case '$eq':
      case '$ne': {
        res[key] = value == null ? null : scalar.encode(value);
        break;
      }

      case '$gt':
      case '$gte':
      case '$lt':
      case '$lte':
      case '$contains':
      case '$startsWith':
      case '$endsWith': {
        if (value == null) break;

        res[key] = scalar.encode(value);
        break;
      }

      case '$in':
      case '$nin': {
        if (!Array.isArray(value)) {
          throw new TypeError(`Expected array for '${key}'`);
        }

        res[key] = value.map((item) =>
          item == null ? null : scalar.encode(item),
        );
        break;
      }

      default: {
        throw new Error(`Unknown where operator: '${key}'`);
      }
    }
  }

  return res as never;
};

const convertMatch = <S extends State>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: Match<S>,
): StoreMatch => {
  const res: StoreMatch = {};

  for (const key in match) {
    const matchOpts = match[key];
    if (matchOpts == null) continue;

    const fields = collection.getFields(key);
    if (!fields.length) continue;

    const relCollections = metadata.getCollections(
      matchOpts.states ?? getCollectionRelationStates(collection, key),
    );

    for (const relCollection of relCollections) {
      const relOptions = convertFilterQueryOptions(
        metadata,
        relCollection,
        matchOpts,
      );

      assginMatchFields(res, fields, relOptions);
    }
  }

  return res;
};

const convertFilterQueryOptions = <S extends State>(
  metadata: Metadata,
  collection: MetadataCollection,
  matchOpts: FilterQueryOptions<S>,
): Pick<StoreMatchOptions, 'where' | 'match'> => ({
  ...(matchOpts.where
    ? { where: convertWhere(collection, matchOpts.where) }
    : null),

  ...(matchOpts.match
    ? { match: convertMatch(metadata, collection, matchOpts.match) }
    : null),
});

const assginMatchFields = (
  match: StoreMatch,
  fields: MetadataOriginStateField[],
  relOptions: Partial<StoreMatchOptions>,
) => {
  for (const field of fields) {
    const { name, relations } = field;

    if (!relations?.length) {
      throw new Error(`Field '${name}' is not a relation`);
    }

    match[name] = [
      ...(match[name] ?? []),
      ...new Map(
        relations
          .map(({ state, path }): [string, StoreMatchOptions] | null => {
            const relField = state.fields.find(
              (f) => f.path?.join('.') === path.join('.'),
            );

            if (!relField) {
              return null;
            }

            return [
              `${state.collectionName}.${relField?.name}`,
              {
                collectionName: state.collectionName,
                by: { [name]: relField?.name },
                ...relOptions,
              },
            ];
          })
          .filter((v): v is [string, StoreMatchOptions] => v != null),
      ).values(),
    ];
  }
};
