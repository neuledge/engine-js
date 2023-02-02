import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataCollection, MetadataState } from '@/metadata';
import {
  StoreFindOptions,
  StoreWhere,
  StoreWhereRecord,
} from '@neuledge/store';
import { Where, WhereQueryOptions } from '@/queries';
import { convertWhereRecord } from './record';

export const convertWhereQuery = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  { where }: WhereQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertWhere(states, collection, where ?? null),
});

const convertWhere = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  where: Where<S> | null,
): StoreWhere => {
  const res: StoreWhereRecord[] = [];

  if (where && where.$or?.length > 0) {
    res.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...where.$or.flatMap((w: StateDefinitionWhereRecord<any>) =>
        convertWhereRecord(states, collection, w),
      ),
    );
  } else {
    res.push(...convertWhereRecord(states, collection, where));
  }

  return res.length === 1 ? res[0] : { $or: res };
};
