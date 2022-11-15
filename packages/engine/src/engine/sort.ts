import { State, SortDefinition } from '@/generated/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import { SortQueryOptions } from '@/queries/index.js';
import { StoreFindOptions, StoreSort } from '@/store/index.js';

export const convertSortQuery = <S extends State>(
  collection: MetadataCollection,
  { sort }: SortQueryOptions<S>,
): Pick<StoreFindOptions, 'sort'> => {
  let reverse = false;

  if (typeof sort === 'string') {
    reverse = sort[0] === '-';

    const key = sort.slice(1);
    for (const state of collection.states) {
      const index = state.origin.$indexes?.[key];
      if (index != null) {
        sort = index;
        break;
      }
    }

    if (typeof sort === 'string') {
      throw new ReferenceError(`Unknown sort key: ${key}`);
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
        throw new ReferenceError(`Unknown sort direction: '${key}'`);
    }

    const field = key.slice(1);

    for (const name of collection.getFieldNames(field)) {
      res[name] = direction;
    }
  }

  return { sort: res };
};
