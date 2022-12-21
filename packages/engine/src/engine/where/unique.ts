import { StateDefinitionWhereRecord } from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { MetadataCollection } from '@/metadata';
import { StoreWhere, StoreWhereRecord } from '@neuledge/store';
import { applyWhereRecordTerm } from './term';

export const convertUniqueWhere = (
  collection: MetadataCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: StateDefinitionWhereRecord<any> | true,
): StoreWhere => {
  if (where === true) {
    throw new NeuledgeError(
      NeuledgeErrorCode.QUERY_EXECUTION_ERROR,
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
    const choices = collection.schema[key];
    if (!choices?.length) {
      throw new NeuledgeError(
        NeuledgeErrorCode.QUERY_PARSING_ERROR,
        `Unknown unique key: '${key}'`,
      );
    }

    const base = records;
    records = [];

    for (const choice of choices) {
      if (!choice.field) {
        throw new NeuledgeError(
          NeuledgeErrorCode.QUERY_PARSING_ERROR,
          `Unknown unique scalar: '${key}'`,
        );
      }

      records.push(...applyWhereRecordTerm(base, choice.field, { $eq: value }));
    }
  }

  return records.length === 1 ? records[0] : { $or: records };
};
