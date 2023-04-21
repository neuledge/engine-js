import { QueryHelpers, whereClause } from '@/helpers';
import { StoreDocument, StoreFindOptions, StoreList } from '@neuledge/store';

export interface FindQueries<Connection> {
  selectFrom(
    connection: Connection,
    name: string,
    select: string[] | true,
    where: string | null,
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
  const {
    collection,
    select: selectMap,
    where,
    innerJoin,
    leftJoin,
    limit,
    offset: storeOffset,
    sort,
  } = options;
  const { name } = collection;

  if (innerJoin || leftJoin || sort) {
    // FIXME implement joins and sorting on postgresql
    throw new Error('Joins and sorting are not supported yet');
  }

  const select = selectMap
    ? Object.keys(selectMap).filter((key) => selectMap[key])
    : true;
  const offset = storeOffset ? Number(storeOffset) : 0;

  const rows = await selectFrom(
    connection,
    name,
    select,
    where ? whereClause(queryHelpers, where) : null,
    limit,
    offset,
  );

  const nextOffset = rows.length < limit ? null : offset + limit;

  return Object.assign(rows, { nextOffset });
};
