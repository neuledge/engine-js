import { State } from '@/generated/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import { Select } from '@/queries/index.js';
import { StoreSelect } from '@/store/index.js';

export const convertSelect = <S extends State>(
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
