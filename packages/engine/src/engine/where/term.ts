import { Scalar } from '@neuledge/scalars';
import equal from 'fast-deep-equal/es6';
import { StateDefinitionWhereTerm } from '@/definitions';
import { StoreWhereRecord, StoreWhereTerm } from '@/store';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { MetadataStateField } from '@/metadata';

export const applyWhereRecordTerm = (
  records: StoreWhereRecord[],
  field: MetadataStateField,
  term: StateDefinitionWhereTerm,
): StoreWhereRecord[] => {
  const res = records.map((record) => ({ ...record }));

  for (const record of res) {
    if (record[field.name] == null) {
      record[field.name] = convertWhereScalarTerm(field.type, term);
    } else {
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Duplicate where key: '${field.path}'`,
      );
    }
  }

  return res;
};

const convertWhereScalarTerm = (
  scalar: Scalar,
  term: StateDefinitionWhereTerm,
): StoreWhereTerm => {
  const res = {} as StoreWhereTerm;

  for (const [operator, value] of Object.entries(term)) {
    assignWhereScalarOperator(res, scalar, operator, value);
  }

  return res;
};

export const applyWhereOperatorTerm = (
  records: StoreWhereRecord[],
  key: string,
  scalar: Scalar,
  operator: string,
  value: unknown,
): StoreWhereRecord[] => {
  const res = [];

  for (const origin of records) {
    const record = { ...origin };
    const scalarValue = scalar.encode(value);

    if (record[key] == null) {
      record[key] = {
        [operator]: scalarValue,
      } as StoreWhereTerm;
    } else {
      const term = { ...record[key] } as never as Record<string, unknown>;
      record[key] = term as never;

      if (operator === '$ne') {
        if ('$eq' in term) {
          if (equal(term.$eq, scalarValue)) {
            // skip conflicts
            continue;
          }

          // else, ignore $ne if $eq is present
        } else if (Array.isArray(term.$nin)) {
          term.$nin = [...term.$nin, scalarValue];
        } else if (!('$ne' in term)) {
          term.$ne = scalarValue;
        } else {
          term.$nin = [term.$ne, scalarValue];
          delete term.$ne;
        }
      } else if (!(operator in term)) {
        term[operator] = scalarValue;

        if (operator === '$eq') {
          delete term.$ne;
        }
      } else if (!equal(term[operator], scalarValue)) {
        // skip conflicts
        continue;
      }
    }

    res.push(record);
  }

  return res;
};

const assignWhereScalarOperator = (
  res: StoreWhereTerm,
  scalar: Scalar,
  operator: string,
  value: unknown,
): void => {
  switch (operator) {
    case '$eq':
    case '$ne':
    case '$gt':
    case '$gte':
    case '$lt':
    case '$lte':
    case '$contains':
    case '$startsWith':
    case '$endsWith': {
      res[operator as never] = (
        value != null ? scalar.encode(value) : null
      ) as never;
      break;
    }

    case '$in':
    case '$nin': {
      if (!Array.isArray(value)) {
        throw new NeuledgeError(
          NeuledgeErrorCode.QUERY_PARSING_ERROR,
          `Expected array for '${operator}' operator`,
        );
      }

      res[operator as never] = value.map((v) =>
        v != null ? scalar.encode(v) : null,
      ) as never;
      break;
    }

    default: {
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Invalid operator: ${operator}`,
      );
    }
  }
};
