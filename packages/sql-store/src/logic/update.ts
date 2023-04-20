import { QueryHelpers, whereClause } from '@/helpers';
import {
  StoreDocument,
  StoreMutationResponse,
  StoreUpdateOptions,
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
    where ? whereClause(queryHelpers, where) : null,
  );

  return {
    affectedCount,
  };
};
