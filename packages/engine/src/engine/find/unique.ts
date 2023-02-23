import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { NeuledgeError } from '@/error';
import { MetadataCollection, MetadataState } from '@/metadata';
import { Filter, FilterQueryOptions, UniqueQueryOptions } from '@/queries';
import {
  StoreFindOptions,
  StoreWhere,
  StoreWhereRecord,
} from '@neuledge/store';
import { applyFilter } from './filter';
import { applyWhereRecordTerm } from './term';

export const convertUniqueFilterQuery = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  { unique, filter }: UniqueQueryOptions<S> & FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertUniqueFilter(states, collection, unique, filter),
});

const convertUniqueFilter = <S extends StateDefinition>(
  states: MetadataState[],
  collection: MetadataCollection,
  unique: StateDefinitionWhereRecord | true,
  filter: Filter<S> | null | undefined,
): StoreWhere => {
  let res = convertUnique(states, collection, unique);

  if (filter != null) {
    res = applyFilter(res, collection, filter);
  }

  return res.length === 1 ? res[0] : { $or: res };
};

const convertUnique = (
  states: MetadataState[],
  collection: MetadataCollection,
  unique: StateDefinitionWhereRecord | true,
): StoreWhereRecord[] => {
  if (unique === true) {
    throw new NeuledgeError(
      NeuledgeError.Code.QUERY_EXECUTION_ERROR,
      `This query is not executable`,
    );
  }

  let records: StoreWhereRecord[] = [
    {
      [collection.reservedNames.hash]: {
        $in: states.map((s) => s.hash),
      },
    },
  ];

  for (const [key, value] of Object.entries(unique)) {
    const choices = collection.schema[key] ?? [];
    if (!choices?.length) {
      throw new NeuledgeError(
        NeuledgeError.Code.QUERY_PARSING_ERROR,
        `Unknown unique key: '${key}'`,
      );
    }

    const base = records;
    records = [];

    for (const choice of choices) {
      if (!choice.field) {
        throw new NeuledgeError(
          NeuledgeError.Code.QUERY_PARSING_ERROR,
          `Unknown unique scalar: '${key}'`,
        );
      }

      records.push(...applyWhereRecordTerm(base, choice.field, { $eq: value }));
    }
  }

  return records;
};
