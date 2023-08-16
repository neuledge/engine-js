import {
  StoreCollection,
  StoreField,
  StoreWhere,
  StoreWhereRecord,
  StoreWhereTerm,
} from '@neuledge/store';
import { QueryHelpers } from './query';

export const getWhere = (
  helpers: QueryHelpers,
  collection: StoreCollection,
  where: StoreWhere,
  from?: string | null,
): string | null => {
  const { $or } = where;

  if (!Array.isArray($or)) {
    return (
      whereRecord(helpers, collection, where as StoreWhereRecord, from) || null
    );
  }

  const sql = $or
    .map((record) => whereRecord(helpers, collection, record, from))
    .filter(Boolean);

  if (sql.length === 0) {
    return null;
  }

  return `(${sql.join(') OR (')})`;
};

const whereRecord = (
  helpers: QueryHelpers,
  collection: StoreCollection,
  record: StoreWhereRecord,
  from?: string | null,
): string => {
  const fromEntry = from ? `${helpers.encodeIdentifier(from)}.` : '';

  return Object.entries(record)
    .map(([columnName, term]) =>
      whereTerm(
        helpers,
        `${fromEntry}${helpers.encodeIdentifier(columnName)}`,
        collection.fields[columnName],
        term,
      ),
    )
    .filter(Boolean)
    .join(' AND ');
};

const whereTerm = (
  helpers: QueryHelpers,
  entry: string,
  field: StoreField,
  term: StoreWhereTerm,
): string =>
  [
    ...whereComparisonTerm(helpers, entry, field, term),
    ...whereLikeTerm(helpers, entry, field, term),
    ...whereInTerm(helpers, entry, field, term),
  ].join(' AND ');

const whereComparisonTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  field: StoreField,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$eq' in term) {
    sql.push(`${entry} = ${encodeLiteral(term.$eq, field)}`);
  }

  if ('$ne' in term) {
    sql.push(`${entry} != ${encodeLiteral(term.$ne, field)}`);
  }

  if ('$gt' in term) {
    sql.push(`${entry} > ${encodeLiteral(term.$gt, field)}`);
  }

  if ('$gte' in term) {
    sql.push(`${entry} >= ${encodeLiteral(term.$gte, field)}`);
  }

  if ('$lt' in term) {
    sql.push(`${entry} < ${encodeLiteral(term.$lt, field)}`);
  }

  if ('$lte' in term) {
    sql.push(`${entry} <= ${encodeLiteral(term.$lte, field)}`);
  }

  return sql;
};

const whereLikeTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  field: StoreField,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$contains' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`%${term.$contains}%`, field)}`);
  }

  if ('$startsWith' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`${term.$startsWith}%`, field)}`);
  }

  if ('$endsWith' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`%${term.$endsWith}`, field)}`);
  }

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${entry} IN (${term.$in
          .map((v) => encodeLiteral(v, field))
          .join(', ')})`,
      );
    }
  }

  return sql;
};

const whereInTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  field: StoreField,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${entry} IN (${term.$in
          .map((v) => encodeLiteral(v, field))
          .join(', ')})`,
      );
    }
  }

  return sql;
};
