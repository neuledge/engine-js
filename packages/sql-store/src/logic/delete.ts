import { QueryHelpers, getWhere } from '@/helpers';
import {
  StoreDeleteOptions,
  StoreMutationResponse,
  throwStoreError,
} from '@neuledge/store';

export interface DeleteQueries<Connection> {
  deleteFrom(
    connection: Connection,
    name: string,
    where: string | null,
  ): Promise<number>;
  queryHelpers: QueryHelpers;
}

export const deletes = async <Connection>(
  options: StoreDeleteOptions,
  connection: Connection,
  { deleteFrom, queryHelpers }: DeleteQueries<Connection>,
): Promise<StoreMutationResponse> => {
  const { collection, where } = options;
  const { name } = collection;

  const affectedCount = await deleteFrom(
    connection,
    name,
    where ? getWhere(queryHelpers, where) : null,
  ).catch(throwStoreError);

  return {
    affectedCount,
  };
};
