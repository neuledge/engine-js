import {
  StateDefinition,
  StateDefinitionWhereRecord,
} from '@/definitions/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import { StoreWhere, StoreWhereRecord } from '@/store/index.js';
import { Where } from '@/queries/index.js';
import { convertWhereRecord } from './record.js';

export const convertWhere = <S extends StateDefinition>(
  collection: MetadataCollection,
  where: Where<S>,
): StoreWhere => {
  const schema = {}; // FIXME set choicesMap
  const res: StoreWhereRecord[] = [];

  if (where.$or?.length > 0) {
    res.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...where.$or.flatMap((w: StateDefinitionWhereRecord<any>) =>
        convertWhereRecord(schema, w),
      ),
    );
  } else {
    res.push(...convertWhereRecord(schema, where));
  }

  return res.length === 1 ? res[0] : { $or: res };
};
