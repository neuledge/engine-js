import { Scalar } from '@neuledge/scalars';
import {
  resolveDefer,
  State,
  StateWhereRecord,
  StateWhereScalar,
} from '@/generated/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import {
  StoreFindOptions,
  StoreScalarValue,
  StoreWhereRecord,
  StoreWhereValue,
} from '@/store/index.js';
import { FilterQueryOptions } from '@/queries/index.js';

export const convertFilter = <S extends State>(
  collection: MetadataCollection,
  { filter, where }: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'filter' | 'where'> => {
  if (where == null) {
    return {};
  }

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

  return { where: res.length === 1 ? res[0] : { $or: res } };
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

  for (const [key, value] of Object.entries(where)) {
    if (value == null) continue;

    const fieldNames = Object.entries(collection.getFieldNameStates(key));
    if (!fieldNames.length) {
      throw new Error(`Unknown field name: '${key}'`);
    }

    for (const [fieldName, states] of fieldNames) {
      const newRecords = new Map();

      for (const state of states) {
        const record = res[state.$key];

        const recordValue = convertWhereValue(
          resolveDefer(state.$scalars)[key].type,
          value,
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

const convertWhereValue = (
  scalar: Scalar,
  where: StateWhereScalar<unknown>,
): StoreWhereValue => {
  const res: Record<string, StoreScalarValue | StoreScalarValue[]> = {};

  for (const [key, value] of Object.entries(where)) {
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
