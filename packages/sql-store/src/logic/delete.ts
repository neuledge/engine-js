import { QueryHelpers, whereClause } from '@/helpers';
import { StoreDeleteOptions, StoreMutationResponse } from '@neuledge/store';

export interface DeleteQueries<Connection> {
  deleteFrom(
    connection: Connection,
    name: string,
    where: string | null,
    limit: number,
  ): Promise<number>;
  queryHelpers: QueryHelpers;
}

export const deletes = async <Connection>(
  options: StoreDeleteOptions,
  connection: Connection,
  { deleteFrom, queryHelpers }: DeleteQueries<Connection>,
): Promise<StoreMutationResponse> => {
  const { collection, where, limit } = options;
  const { name } = collection;

  const affectedCount = await deleteFrom(
    connection,
    name,
    where ? whereClause(queryHelpers, where) : null,
    limit,
  );

  return {
    affectedCount,
  };
};
