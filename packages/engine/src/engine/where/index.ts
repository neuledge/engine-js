import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataCollection } from '@/metadata';
import { StoreWhere, StoreWhereRecord } from '@neuledge/store';
import { Where } from '@/queries';
import { convertWhereRecord } from './record';

export const convertWhere = <S extends StateDefinition>(
  collection: MetadataCollection,
  where: Where<S> | null,
): StoreWhere => {
  const res: StoreWhereRecord[] = [];

  if (where && where.$or?.length > 0) {
    res.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...where.$or.flatMap((w: StateDefinitionWhereRecord<any>) =>
        convertWhereRecord(collection, w),
      ),
    );
  } else {
    res.push(...convertWhereRecord(collection, where));
  }

  return res.length === 1 ? res[0] : { $or: res };
};
