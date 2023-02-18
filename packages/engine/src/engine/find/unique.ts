import { StateDefinition, StateDefinitionWhereRecord } from '@/definitions';
import { NeuledgeError } from '@/error';
import { MetadataCollection } from '@/metadata';
import { UniqueQueryOptions } from '@/queries';
import {
  StoreFindOptions,
  StoreWhere,
  StoreWhereRecord,
} from '@neuledge/store';
import { applyWhereRecordTerm } from './term';

export const convertUniqueQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { unique }: UniqueQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertUnique(collection, unique),
});

const convertUnique = (
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereRecord<any> | true,
): StoreWhere => {
  if (where === true) {
    throw new NeuledgeError(
      NeuledgeError.Code.QUERY_EXECUTION_ERROR,
      `This query is not executable`,
    );
  }

  let records: StoreWhereRecord[] = [
    {
      [collection.reservedNames.hash]: {
        $in: collection.states.map((s) => s.hash),
      },
    },
  ];

  for (const [key, value] of Object.entries(where)) {
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

  return records.length === 1 ? records[0] : { $or: records };
};