import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { MetadataCollection, MetadataState } from '@/metadata';
import {
  StoreFindOptions,
  StoreWhere,
  StoreWhereRecord,
} from '@neuledge/store';
import {
  Filter,
  FilterQueryOptions,
  Where,
  WhereQueryOptions,
} from '@/queries';
import { applyFilterRecord, convertWhereRecord } from './record';

export const convertWhereFilterQuery = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  { where, filter }: WhereQueryOptions<S> & FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertWhereFilter(states, collection, where ?? null, filter ?? null),
});

export const convertFilterQuery = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  { filter }: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertWhereFilter(states, collection, null, filter ?? null),
});

const convertWhereFilter = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  where: Where<S> | null,
  filter: Filter<S> | null,
): StoreWhere => {
  let res = convertWhere(states, collection, where);

  if (filter != null) {
    res = applyFilter(res, collection, filter);
  }

  return res.length === 1 ? res[0] : { $or: res };
};

const convertWhere = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  where: Where<S> | null,
): StoreWhereRecord[] =>
  where && Array.isArray(where.$or)
    ? where.$or.flatMap((w: StateDefinitionWhereRecord) =>
        convertWhereRecord(states, collection, w),
      )
    : convertWhereRecord(
        states,
        collection,
        where as StateDefinitionWhereRecord,
      );

const applyFilter = <S extends StateDefinition>(
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
