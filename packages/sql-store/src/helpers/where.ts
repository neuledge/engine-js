import { StoreWhere, StoreWhereRecord, StoreWhereTerm } from '@neuledge/store';
import { QueryHelpers } from './query';

export const getWhere = (
  helpers: QueryHelpers,
  where: StoreWhere,
): string | null => {
  const { $or } = where;

  if (!Array.isArray($or)) {
    return whereRecord(helpers, where as StoreWhereRecord) || null;
  }

  const sql = $or.map((record) => whereRecord(helpers, record)).filter(Boolean);

  if (sql.length === 0) {
    return null;
  }

  return `(${sql.join(') OR (')})`;
};

const whereRecord = (helpers: QueryHelpers, record: StoreWhereRecord): string =>
  Object.entries(record)
    .map(([columnName, term]) => whereTerm(helpers, columnName, term))
    .filter(Boolean)
    .join(' AND ');

const whereTerm = (
  helpers: QueryHelpers,
  columnName: string,
  term: StoreWhereTerm,
): string =>
  [
    ...whereComparisonTerm(helpers, columnName, term),
    ...whereLikeTerm(helpers, columnName, term),
    ...whereInTerm(helpers, columnName, term),
  ].join(' AND ');

const whereComparisonTerm = (
  { encodeIdentifier, encodeLiteral }: QueryHelpers,
  columnName: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$eq' in term) {
    sql.push(`${encodeIdentifier(columnName)} = ${encodeLiteral(term.$eq)}`);
  }

  if ('$ne' in term) {
    sql.push(`${encodeIdentifier(columnName)} != ${encodeLiteral(term.$ne)}`);
  }

  if ('$gt' in term) {
    sql.push(`${encodeIdentifier(columnName)} > ${encodeLiteral(term.$gt)}`);
  }

  if ('$gte' in term) {
    sql.push(`${encodeIdentifier(columnName)} >= ${encodeLiteral(term.$gte)}`);
  }

  if ('$lt' in term) {
    sql.push(`${encodeIdentifier(columnName)} < ${encodeLiteral(term.$lt)}`);
  }

  if ('$lte' in term) {
    sql.push(`${encodeIdentifier(columnName)} <= ${encodeLiteral(term.$lte)}`);
  }

  return sql;
};

const whereLikeTerm = (
  { encodeIdentifier, encodeLiteral }: QueryHelpers,
  columnName: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$contains' in term) {
    sql.push(
      `${encodeIdentifier(columnName)} LIKE ${encodeLiteral(
        `%${term.$contains}%`,
      )}`,
    );
  }

  if ('$startsWith' in term) {
    sql.push(
      `${encodeIdentifier(columnName)} LIKE ${encodeLiteral(
        `${term.$startsWith}%`,
      )}`,
    );
  }

  if ('$endsWith' in term) {
    sql.push(
      `${encodeIdentifier(columnName)} LIKE ${encodeLiteral(
        `%${term.$endsWith}`,
      )}`,
    );
  }

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${encodeIdentifier(columnName)} IN (${term.$in
          .map((v) => encodeLiteral(v))
          .join(', ')})`,
      );
    }
  }

  return sql;
};

const whereInTerm = (
  { encodeIdentifier, encodeLiteral }: QueryHelpers,
  columnName: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${encodeIdentifier(columnName)} IN (${term.$in
          .map((v) => encodeLiteral(v))
          .join(', ')})`,
      );
    }
  }

  return sql;
};
