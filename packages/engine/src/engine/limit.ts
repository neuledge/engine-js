import { Metadata } from '@/metadata/index.js';
import { LimitQueryOptions } from '@/queries/index.js';
import { StoreFindOptions, StoreList } from '@/store/index.js';
import { toEntityList } from './entity.js';

const DEFAULT_QUERY_LIMIT = 100;

export const convertLimit = (
  options: LimitQueryOptions,
): Pick<StoreFindOptions, 'limit'> => ({
  limit: options.limit ?? DEFAULT_QUERY_LIMIT,
});

export const toLimitedEntityList = (
  metadata: Metadata,
  options: LimitQueryOptions,
  list: StoreList,
) => {
  if (options.limit == null && list.length >= DEFAULT_QUERY_LIMIT) {
    throw new RangeError(
      "Too many documents found without a predefined limit. If that's intentional, please set the limit option with a high enough value.",
    );
  }

  return toEntityList(metadata, list);
};
