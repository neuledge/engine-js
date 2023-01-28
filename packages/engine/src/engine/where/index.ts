import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataCollection, MetadataState } from '@/metadata';
import { StoreWhere, StoreWhereRecord } from '@neuledge/store';
import { Where } from '@/queries';
import { convertWhereRecord } from './record';

export const convertWhere = <S extends StateDefinition>(
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
