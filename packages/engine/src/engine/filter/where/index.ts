import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataSchema } from '@/metadata';
import { StoreWhere, StoreWhereRecord } from '@/store';
import { Where } from '@/queries';
import { convertWhereRecord } from './record';

export const convertWhere = <S extends StateDefinition>(
  schema: MetadataSchema,
  where: Where<S>,
): StoreWhere => {
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
