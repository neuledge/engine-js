import { QueryHelpers, getWhere } from '@/helpers';
import {
  StoreDocument,
  StoreMutationResponse,
  StoreUpdateOptions,
  throwStoreError,
} from '@neuledge/store';

export interface UpdateQueries<Connection> {
  updateSet(
    connection: Connection,
    name: string,
    set: StoreDocument,
    where: string | null,
  ): Promise<number>;
  queryHelpers: QueryHelpers;
}

export const update = async <Connection>(
  options: StoreUpdateOptions,
  connection: Connection,
  { updateSet, queryHelpers }: UpdateQueries<Connection>,
): Promise<StoreMutationResponse> => {
  const { collection, set, where } = options;
  const { name } = collection;

  const affectedCount = await updateSet(
    connection,
    name,
    set,
    where ? getWhere(queryHelpers, where) : null,
  ).catch(throwStoreError);

  return {
    affectedCount,
  };
};
