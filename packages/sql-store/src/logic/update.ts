import { QueryHelpers, getWhere } from '@/helpers';
import {
  StoreField,
  StoreMutationResponse,
  StoreScalarValue,
  StoreUpdateOptions,
  throwStoreError,
} from '@neuledge/store';

export interface UpdateQueries<Connection> {
  updateSet(
    connection: Connection,
    name: string,
    setValues: [field: StoreField, value: StoreScalarValue][],
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
  const { name, fields } = collection;

  const setValues = Object.entries(set).map(
    ([key, value]): [field: StoreField, value: StoreScalarValue] => [
      fields[key],
      value ?? null,
    ],
  );

  const affectedCount = await updateSet(
    connection,
    name,
    setValues,
    where ? getWhere(queryHelpers, collection, where) : null,
  ).catch(throwStoreError);

  return {
    affectedCount,
  };
};
