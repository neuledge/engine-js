import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataCollection } from '@/metadata';
import { StoreWhereRecord } from '@neuledge/store';
import { Filter } from '@/queries';
import { applyFilterRecord } from './record';

export const applyFilter = <S extends StateDefinition>(
  records: StoreWhereRecord[],
  collection: MetadataCollection,
  filter: Filter<S>,
): StoreWhereRecord[] =>
  Array.isArray(filter.$or)
    ? filter.$or.flatMap((w: StateDefinitionWhereRecord) =>
        applyFilterRecord(records, collection, w),
      )
    : applyFilterRecord(
        records,
        collection,
        filter as StateDefinitionWhereRecord,
      );
