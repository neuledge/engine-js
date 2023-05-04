import {
  QueryHelpers,
  convertRawDocument,
  getFromJoins,
  getOrderBy,
  getSelectAny,
  getSelectColumns,
  getWhere,
} from '@/helpers';
import {
  StoreDocument,
  StoreFindOptions,
  StoreList,
  throwStoreError,
} from '@neuledge/store';

export interface FindQueries<Connection> {
  selectFrom(
    connection: Connection,
    select: string,
    from: string,
    where: string | null,
    orderBy: string | null,
    limit: number,
    offset: number,
  ): Promise<StoreDocument[]>;
  queryHelpers: QueryHelpers;
}

export const find = async <Connection>(
  options: StoreFindOptions,
  connection: Connection,
  { selectFrom, queryHelpers }: FindQueries<Connection>,
): Promise<StoreList> => {
  const { collection, select, where, limit, offset, sort } = options;

  let from = queryHelpers.encodeIdentifier(collection.name);
  const join = getFromJoins(queryHelpers, options);

  let selectColumns;
  const whereClauses = where ? [getWhere(queryHelpers, where)] : [];

  if (join) {
    from += ` ${queryHelpers.encodeIdentifier(
      join.fromAlias,
    )} ${join.fromJoins.join(' ')}`;

    selectColumns = select
      ? getSelectColumns(queryHelpers, join.fromAlias, select)
      : [getSelectAny(queryHelpers, join.fromAlias)];

    selectColumns.push(...join.selectColumns);
    whereClauses.push(...join.whereClauses);
  } else {
    selectColumns = select
      ? getSelectColumns(queryHelpers, null, select)
      : ['*'];
  }

  const offsetNumber = offset ? Number(offset) : 0;

  const rawDocs = await selectFrom(
    connection,
    selectColumns.join(', '),
    from,
    whereClauses.join(' AND ') || null,
    sort ? getOrderBy(queryHelpers, sort) : null,
    limit,
    offsetNumber,
  ).catch(throwStoreError);

  const docs = rawDocs.map((rawDoc) => convertRawDocument(rawDoc));
  const nextOffset = rawDocs.length < limit ? null : offsetNumber + limit;

  return Object.assign(docs, { nextOffset });
};
