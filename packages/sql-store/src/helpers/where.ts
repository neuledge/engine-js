import { StoreWhere, StoreWhereRecord, StoreWhereTerm } from '@neuledge/store';
import { QueryHelpers } from './query';

export const getWhere = (
  helpers: QueryHelpers,
  where: StoreWhere,
  from?: string | null,
): string | null => {
  const { $or } = where;

  if (!Array.isArray($or)) {
    return whereRecord(helpers, where as StoreWhereRecord, from) || null;
  }

  const sql = $or
    .map((record) => whereRecord(helpers, record, from))
    .filter(Boolean);

  if (sql.length === 0) {
    return null;
  }

  return `(${sql.join(') OR (')})`;
};

const whereRecord = (
  helpers: QueryHelpers,
  record: StoreWhereRecord,
  from?: string | null,
): string => {
  const fromEntry = from ? `${helpers.encodeIdentifier(from)}.` : '';

  return Object.entries(record)
    .map(([columnName, term]) =>
      whereTerm(
        helpers,
        `${fromEntry}${helpers.encodeIdentifier(columnName)}`,
        term,
      ),
    )
    .filter(Boolean)
    .join(' AND ');
};

const whereTerm = (
  helpers: QueryHelpers,
  entry: string,
  term: StoreWhereTerm,
): string =>
  [
    ...whereComparisonTerm(helpers, entry, term),
    ...whereLikeTerm(helpers, entry, term),
    ...whereInTerm(helpers, entry, term),
  ].join(' AND ');

const whereComparisonTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$eq' in term) {
    sql.push(`${entry} = ${encodeLiteral(term.$eq)}`);
  }

  if ('$ne' in term) {
    sql.push(`${entry} != ${encodeLiteral(term.$ne)}`);
  }

  if ('$gt' in term) {
    sql.push(`${entry} > ${encodeLiteral(term.$gt)}`);
  }

  if ('$gte' in term) {
    sql.push(`${entry} >= ${encodeLiteral(term.$gte)}`);
  }

  if ('$lt' in term) {
    sql.push(`${entry} < ${encodeLiteral(term.$lt)}`);
  }

  if ('$lte' in term) {
    sql.push(`${entry} <= ${encodeLiteral(term.$lte)}`);
  }

  return sql;
};

const whereLikeTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$contains' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`%${term.$contains}%`)}`);
  }

  if ('$startsWith' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`${term.$startsWith}%`)}`);
  }

  if ('$endsWith' in term) {
    sql.push(`${entry} LIKE ${encodeLiteral(`%${term.$endsWith}`)}`);
  }

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${entry} IN (${term.$in.map((v) => encodeLiteral(v)).join(', ')})`,
      );
    }
  }

  return sql;
};

const whereInTerm = (
  { encodeLiteral }: QueryHelpers,
  entry: string,
  term: StoreWhereTerm,
): string[] => {
  const sql: string[] = [];

  if ('$in' in term) {
    if (term.$in.length === 0) {
      sql.push('FALSE');
    } else {
      sql.push(
        `${entry} IN (${term.$in.map((v) => encodeLiteral(v)).join(', ')})`,
      );
    }
  }

  return sql;
};
