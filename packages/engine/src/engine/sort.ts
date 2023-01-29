import { StateDefinition, SortDefinition } from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
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
        NeuledgeErrorCode.UNKNOWN_SORT_INDEX,
        `Unknown sort index: ${indexKey}`,
      );
    }
  } else if (sort == null) {
    return {};
  }

  const res: StoreSort = {};

  for (const key of sort as SortDefinition<S>) {
    let direction: 'asc' | 'desc';
    switch (key[0]) {
      case '+':
        direction = reverse ? 'desc' : 'asc';
        break;

      case '-':
        direction = reverse ? 'asc' : 'desc';
        break;

      default:
        throw new NeuledgeError(
          NeuledgeErrorCode.UNKNOWN_SORT_DIRECTION,
          `Unknown sort direction: '${key}'`,
        );
    }

    const field = key.slice(1);

    for (const name of collection.getFieldNames(field)) {
      res[name] = direction;
    }
  }

  return { sort: res };
};
