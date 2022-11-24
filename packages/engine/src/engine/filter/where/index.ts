import {
  StateDefinition,
  StateDefinitionWhereFields,
} from '@/definitions/index.js';
import {
  MetadataCollection,
  MetadataCollectionFieldMap,
} from '@/metadata/index.js';
import { StoreWhere, StoreWhereRecord } from '@/store/index.js';
import { Where } from '@/queries/index.js';

export const convertWhere = <S extends StateDefinition>(
  collection: MetadataCollection,
  where: Where<S>,
): StoreWhere => {
  const fieldMap = collection.getFieldMap();
  const res: StoreWhereRecord[] = [];

  if (where.$or?.length > 0) {
    res.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...where.$or.flatMap((w: StateDefinitionWhereFields<any>) =>
        convertWhereFields(fieldMap, w),
      ),
    );
  } else {
    res.push(...convertWhereFields(fieldMap, where));
  }

  return res.length === 1 ? res[0] : { $or: res };
};

const convertWhereFields = (
  fieldMap: MetadataCollectionFieldMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereFields<any>,
): StoreWhereRecord[] => {
  const records: StoreWhereRecord[] = [{}];

  // FIXME this is a hack to make sure that the where clause is not empty
  //   for (const [path, term] of Object.entries(where)) {
  //     if (term == null) continue;
  //
  //     for (const [operator, value] of Object.entries(term)) {
  //       records = convertWhereOperator(records, fieldMap, path, operator, value);
  //     }
  //   }

  return records;
};
