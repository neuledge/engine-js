import { StateDefinition } from '@/definitions/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import { SelectQueryOptions } from '@/queries/index.js';
import { StoreFindOptions, StoreSelect } from '@/store/index.js';

export const convertSelectQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select /* , requireOne, includeOne, includeMany */ }: SelectQueryOptions<S>,
): Pick<StoreFindOptions, 'select' | 'includeFirst' | 'requireFirst'> => {
  if (select == null) {
    return {};
  }

  const res: StoreSelect = {};

  for (const key in select) {
    if (!select[key]) continue;

    for (const fieldName of collection.getFieldNames(key)) {
      res[fieldName] = true;
    }
  }

  return { select: res };
};
