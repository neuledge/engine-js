import { State, StateSort } from '@/generated/index.js';
import { MetadataCollection } from '@/metadata/index.js';
import { Sort } from '@/queries/index.js';
import { StoreSort } from '@/store/index.js';

export const convertSort = <S extends State>(
  collection: MetadataCollection,
  sort: Sort<S>,
): StoreSort => {
  if (typeof sort === 'string') {
    const key = sort;

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
  }

  const res: StoreSort = {};

  for (const key of sort as StateSort<S>) {
    let direction;
    switch (key[0]) {
      case '+':
        direction = 'asc' as const;
        break;

      case '-':
        direction = 'desc' as const;
        break;

      default:
        throw new ReferenceError(`Unknown sort direction: '${key}'`);
    }

    const field = key.slice(1);

    for (const name of collection.getFieldNames(field)) {
      res[name] = direction;
    }
  }

  return res;
};
