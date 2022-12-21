import { StateDefinition } from '@/definitions';
import { MetadataCollection } from '@/metadata';
import { Select } from '@/queries';
import { StoreSelect } from '@neuledge/store';

export const convertSelectQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  select: Select<S>,
): StoreSelect => {
  const res: StoreSelect = {};

  for (const key in select) {
    if (!select[key]) continue;

    for (const fieldName of collection.getFieldNames(key)) {
      res[fieldName] = true;
    }
  }

  return res;
};
