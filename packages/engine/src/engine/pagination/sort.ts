import { StateDefinition, SortDefinition } from '@/definitions';
import { NeuledgeError } from '@/error';
import { MetadataCollection } from '@/metadata';
import { SortQueryOptions } from '@/queries';
import { StoreFindOptions, StoreSort } from '@neuledge/store';

export const convertSortQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { sort }: SortQueryOptions<S>,
): Pick<StoreFindOptions, 'sort'> => {
  let reverse = false;

  if (typeof sort === 'string') {
    reverse = sort[0] === '-';

    const indexKey = sort.slice(1);
    for (const state of collection.states) {
      const index = state.instance.$indexes?.[indexKey];
      if (index != null) {
        sort = index.fields;
        break;
      }
    }

    if (typeof sort === 'string') {
      throw new NeuledgeError(
        NeuledgeError.Code.UNKNOWN_SORT_INDEX,
        `Unknown sort index: ${indexKey}`,
      );
    }
  } else if (sort == null) {
    return {};
  }

  const res: StoreSort = {};

  for (const key of sort as SortDefinition<S>) {
    let sort: 'asc' | 'desc';
    switch (key[0]) {
      case '+': {
        sort = reverse ? 'desc' : 'asc';
        break;
      }

      case '-': {
        sort = reverse ? 'asc' : 'desc';
        break;
      }

      default: {
        throw new NeuledgeError(
          NeuledgeError.Code.UNKNOWN_SORT_DIRECTION,
          `Unknown sort direction: '${key}'`,
        );
      }
    }

    const field = key.slice(1);

    for (const name of collection.getSchemaFieldNames(field)) {
      res[name] = sort;
    }
  }

  return { sort: res };
};
