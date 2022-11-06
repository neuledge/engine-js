import { Scalar } from '@neuledge/scalars';
import {
  resolveDefer,
  StateWhere,
  StateWhereRecord,
  StateWhereScalar,
} from '@/generated/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import {
  StoreScalarValue,
  StoreWhere,
  StoreWhereRecord,
  StoreWhereValue,
} from '@/store/index.js';

export const convertWhere = (
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateWhere<any>,
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
    if (value == null) continue;

    switch (key) {
      case '$eq':
      case '$ne':
      case '$gt':
      case '$gte':
      case '$lt':
      case '$lte':
      case '$contains':
      case '$startsWith':
      case '$endsWith': {
        res[key] = scalar.encode(value);
        break;
      }

      case '$in':
      case '$nin': {
        if (!Array.isArray(value)) {
          throw new TypeError(`Expected array for '${key}'`);
        }

        res[key] = value.map((item) => scalar.encode(item));
        break;
      }

      default: {
        throw new Error(`Unknown where operator: '${key}'`);
      }
    }
  }

  return res as never;
};
