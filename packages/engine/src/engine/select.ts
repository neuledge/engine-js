import { StateDefinition } from '@/definitions';
import { MetadataCollection } from '@/metadata';
import { Select, SelectQueryOptions } from '@/queries';
import {
  StoreFindOptions,
  StoreJoinChoice,
  StoreLeftJoinChoice,
  StoreSelect,
} from '@neuledge/store';

export const convertSelectQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select }: SelectQueryOptions<S>,
): Pick<StoreFindOptions, 'select'> => ({
  ...(select != null && select !== true
    ? { select: convertSelect(collection, select) }
    : null),
});

export const convertJoinSelectQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select }: SelectQueryOptions<S>,
): Pick<StoreJoinChoice, 'select'> => ({
  ...(select == null
    ? null
    : { select: select === true ? true : convertSelect(collection, select) }),
});

export const convertLeftJoinSelectQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select }: SelectQueryOptions<S>,
): Pick<StoreLeftJoinChoice, 'select'> => ({
  select:
    select != null && select !== true
      ? convertSelect(collection, select)
      : true,
});

const convertSelect = <S extends StateDefinition>(
  collection: MetadataCollection,
  select: Select<S>,
): StoreSelect => {
  const res: StoreSelect = {
    [collection.reservedNames.hash]: true,
    [collection.reservedNames.version]: true,
  };

  for (const key in select) {
    if (!select[key]) continue;

    for (const fieldName of collection.getSchemaFieldNames(key)) {
      res[fieldName] = true;
    }
  }

  return res;
};
