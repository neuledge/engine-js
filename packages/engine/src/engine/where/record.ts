import {
  StateDefinitionWhereRecord,
  StateDefinitionWhereTerm,
} from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { MetadataCollection, MetadataSchema, MetadataState } from '@/metadata';
import { StoreWhereRecord } from '@neuledge/store';
import { applyWhereOperatorTerm, applyWhereRecordTerm } from './term';

export const convertWhereRecord = (
  states: MetadataState[],
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereRecord<any> | null,
): StoreWhereRecord[] => {
  let records: StoreWhereRecord[] = [
    {
      [collection.reservedNames.hash]: {
        $in: states.map((s) => s.hash),
      },
    },
  ];

  for (const [key, term] of Object.entries(where ?? {})) {
    if (term == null) continue;

    const choices = collection.schema[key] ?? [];
    if (!choices?.length) {
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Unknown where key: '${key}'`,
      );
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

const applyWhereState = (
  records: StoreWhereRecord[],
  schema: MetadataSchema,
  term: StateDefinitionWhereTerm,
): StoreWhereRecord[] => {
  for (const [operator, where] of Object.entries(term)) {
    if (typeof where !== 'object' || where == null) {
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Invalid where operator: '${operator}'`,
      );
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
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Invalid operator: ${operator}`,
      );
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
    throw new NeuledgeError(
      NeuledgeErrorCode.QUERY_PARSING_ERROR,
      `Invalid where operator: '$in'`,
    );
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
    throw new NeuledgeError(
      NeuledgeErrorCode.QUERY_PARSING_ERROR,
      `Invalid where operator: '$nin'`,
    );
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
  const choices = Object.values(schema[key] ?? {});
  if (!choices?.length) {
    throw new NeuledgeError(
      NeuledgeErrorCode.QUERY_PARSING_ERROR,
      `Unknown where key: '${key}'`,
    );
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
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Invalid where operator: '${operator}'`,
      );
    }
  }

  return res;
};
