import {
  StateDefinitionWhereRecord,
  StateDefinitionWhereTerm,
} from '@/definitions/index.js';
import { MetadataStateField } from '@/metadata/index.js';
import { StoreWhereRecord } from '@/store/index.js';
import { applyWhereOperatorTerm, convertWhereScalarTerm } from './term.js';

export type WhereChoicesMap = {
  [Key in string]?: WhereChoice[];
};

export type WhereChoice =
  | { field: MetadataStateField; state?: never }
  | { field?: never; state: WhereChoicesMap };

export const convertWhereRecord = (
  choicesMap: WhereChoicesMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereRecord<any>,
): StoreWhereRecord[] => {
  let records: StoreWhereRecord[] = [{}];

  for (const [key, term] of Object.entries(where)) {
    if (term == null) continue;

    const choices = choicesMap[key];
    if (!choices?.length) {
      throw new Error(`Unknown where key: '${key}'`);
    }

    const base = records;
    records = [];

    for (const choice of choices) {
      records.push(
        ...(choice.field
          ? applyWhereRecordTerm(base, choice.field, term)
          : applyWhereState(base, choice.state, term)),
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
  choicesMap: WhereChoicesMap,
  term: StateDefinitionWhereTerm,
): StoreWhereRecord[] => {
  for (const [operator, where] of Object.entries(term)) {
    if (typeof where !== 'object' || where == null) {
      throw new Error(`Invalid where operator: '${operator}'`);
    }

    records = applyWhereOperatorRecord(records, choicesMap, operator, where);
  }

  return records;
};

const applyWhereOperatorRecord = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
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
      return applyWhereEveryOperatorRecord(
        records,
        choicesMap,
        operator,
        where,
      );
    }

    case '$ne': {
      return applyWhereNotEqualRecord(records, choicesMap, where);
    }

    case '$in': {
      return applyWhereInOperatorRecord(records, choicesMap, where);
    }

    case '$nin': {
      return applyWhereNotInOperatorRecord(records, choicesMap, where);
    }

    default: {
      throw new Error(`Invalid operator: ${operator}`);
    }
  }
};

const applyWhereEveryOperatorRecord = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
  operator: string,
  where: object,
) => {
  for (const [key, value] of Object.entries(where)) {
    records = applyWhereOperatorRecordValue(
      records,
      choicesMap,
      operator,
      key,
      value,
    );
  }

  return records;
};

const applyWhereNotEqualRecord = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
  where: object,
) => {
  let base = records;
  const res = [];

  for (const [key, value] of Object.entries(where)) {
    res.push(
      ...applyWhereOperatorRecordValue(base, choicesMap, '$ne', key, value),
    );

    base = applyWhereOperatorRecordValue(base, choicesMap, '$eq', key, value);
  }

  return res;
};

const applyWhereInOperatorRecord = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
  where: object,
) => {
  if (!Array.isArray(where)) {
    throw new TypeError(`Invalid where operator: '$in'`);
  }

  const res = [];
  for (const value of where) {
    res.push(
      ...applyWhereEveryOperatorRecord(records, choicesMap, '$eq', value),
    );
  }

  return res;
};

const applyWhereNotInOperatorRecord = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
  where: object,
) => {
  if (!Array.isArray(where)) {
    throw new TypeError(`Invalid where operator: '$nin'`);
  }

  for (const value of where) {
    records = applyWhereNotEqualRecord(records, choicesMap, value);
  }

  return records;
};

const applyWhereOperatorRecordValue = (
  records: StoreWhereRecord[],
  choicesMap: WhereChoicesMap,
  operator: string,
  key: string,
  value: unknown,
): StoreWhereRecord[] => {
  const choices = choicesMap[key];
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
        ...applyWhereOperatorRecord(records, choice.state, operator, value),
      );
    } else {
      throw new Error(`Invalid where operator: '${operator}'`);
    }
  }

  return res;
};
