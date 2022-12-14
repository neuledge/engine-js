import {
  StateDefinitionWhereRecord,
  StateDefinitionWhereTerm,
} from '@/definitions';
import {
  MetadataCollection,
  MetadataSchema,
  MetadataStateField,
} from '@/metadata';
import { StoreWhereRecord } from '@/store';
import { applyWhereOperatorTerm, convertWhereScalarTerm } from './term';

export const convertWhereRecord = (
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereRecord<any> | null,
): StoreWhereRecord[] => {
  let records: StoreWhereRecord[] = [
    {
      [collection.reservedNames.hash]: {
        $in: collection.states.map((s) => s.hash),
      },
    },
  ];

  for (const [key, term] of Object.entries(where ?? {})) {
    if (term == null) continue;

    const choices = collection.schema[key];
    if (!choices?.length) {
      throw new Error(`Unknown where key: '${key}'`);
    }

    const base = records;
    records = [];

    for (const choice of choices) {
      records.push(
        ...(choice.field
          ? applyWhereRecordTerm(base, choice.field, term)
          : applyWhereState(base, choice.schema, term)),
      );
    }
  }

  return records;
};

const applyWhereRecordTerm = (
  records: StoreWhereRecord[],
  field: MetadataStateField,
  term: StateDefinitionWhereTerm,
): StoreWhereRecord[] => {
  const res = records.map((record) => ({ ...record }));

  for (const record of res) {
    if (record[field.name] == null) {
      record[field.name] = convertWhereScalarTerm(field.type, term);
    } else {
      throw new Error(`Duplicate where key: '${field.path}'`);
    }
  }

  return res;
};

const applyWhereState = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  term: StateDefinitionWhereTerm,
): StoreWhereRecord[] => {
  for (const [operator, where] of Object.entries(term)) {
    if (typeof where !== 'object' || where == null) {
      throw new Error(`Invalid where operator: '${operator}'`);
    }

    records = applyWhereOperatorRecord(records, schema, operator, where);
  }

  return records;
};

const applyWhereOperatorRecord = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  operator: string,
  where: object,
): StoreWhereRecord[] => {
  switch (operator) {
    case '$eq':
    case '$gt':
    case '$gte':
    case '$lt':
    case '$lte':
    case '$contains':
    case '$startsWith':
    case '$endsWith': {
      return applyWhereEveryOperatorRecord(records, schema, operator, where);
    }

    case '$ne': {
      return applyWhereNotEqualRecord(records, schema, where);
    }

    case '$in': {
      return applyWhereInOperatorRecord(records, schema, where);
    }

    case '$nin': {
      return applyWhereNotInOperatorRecord(records, schema, where);
    }

    default: {
      throw new Error(`Invalid operator: ${operator}`);
    }
  }
};

const applyWhereEveryOperatorRecord = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  operator: string,
  where: object,
) => {
  for (const [key, value] of Object.entries(where)) {
    records = applyWhereOperatorRecordValue(
      records,
      schema,
      operator,
      key,
      value,
    );
  }

  return records;
};

const applyWhereNotEqualRecord = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  where: object,
) => {
  let base = records;
  const res = [];

  for (const [key, value] of Object.entries(where)) {
    res.push(...applyWhereOperatorRecordValue(base, schema, '$ne', key, value));

    base = applyWhereOperatorRecordValue(base, schema, '$eq', key, value);
  }

  return res;
};

const applyWhereInOperatorRecord = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  where: object,
) => {
  if (!Array.isArray(where)) {
    throw new TypeError(`Invalid where operator: '$in'`);
  }

  const res = [];
  for (const value of where) {
    res.push(...applyWhereEveryOperatorRecord(records, schema, '$eq', value));
  }

  return res;
};

const applyWhereNotInOperatorRecord = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  where: object,
) => {
  if (!Array.isArray(where)) {
    throw new TypeError(`Invalid where operator: '$nin'`);
  }

  for (const value of where) {
    records = applyWhereNotEqualRecord(records, schema, value);
  }

  return records;
};

const applyWhereOperatorRecordValue = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  operator: string,
  key: string,
  value: unknown,
): StoreWhereRecord[] => {
  const choices = schema[key];
  if (!choices?.length) {
    throw new Error(`Unknown where key: '${key}'`);
  }

  const res = [];

  for (const choice of choices) {
    if (choice.field) {
      res.push(
        ...applyWhereOperatorTerm(
          records,
          choice.field.name,
          choice.field.type,
          operator,
          value,
        ),
      );
    } else if (typeof value === 'object' && value != null) {
      res.push(
        ...applyWhereOperatorRecord(records, choice.schema, operator, value),
      );
    } else {
      throw new Error(`Invalid where operator: '${operator}'`);
    }
  }

  return res;
};
