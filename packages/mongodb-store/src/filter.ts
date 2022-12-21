import { StoreScalarValue, StoreWhere, StoreWhereTerm } from '@neuledge/store';
import { Filter, Document, FilterOperators } from 'mongodb';
import { escapeFieldName } from './fields';

export const findFilter = (where: StoreWhere): Filter<Document> => {
  if (Array.isArray(where.$or)) {
    return {
      $or: where.$or.map((record) => findFilter(record)),
    };
  }

  const res: Filter<Document> = {};

  for (const [fieldName, term] of Object.entries(where)) {
    res[escapeFieldName(fieldName)] = filterTerm(term);
  }

  return res;
};

const filterTerm = (
  term: StoreWhereTerm,
): FilterOperators<StoreScalarValue> => {
  const res: FilterOperators<StoreScalarValue> = {};

  for (const [operator, value] of Object.entries(term)) {
    switch (operator) {
      case '$eq':
      case '$ne':
      case '$lt':
      case '$lte':
      case '$gt':
      case '$gte':
      case '$in':
      case '$nin': {
        res[operator] = value;
        break;
      }

      case '$contains': {
        res.$regex = new RegExp(escapeRegExp(value));
        break;
      }

      case '$startsWith': {
        res.$regex = new RegExp(`^${escapeRegExp(value)}`);
        break;
      }

      case '$endsWith': {
        res.$regex = new RegExp(`${escapeRegExp(value)}$`);
        break;
      }

      default: {
        throw new Error(`Unknown operator: ${operator}`);
      }
    }
  }

  return res;
};

const escapeRegExp = (string: string): string =>
  string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'); // $& means the whole matched string
