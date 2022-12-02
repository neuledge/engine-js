import { Metadata } from '@/metadata/index.js';
import { LimitQueryOptions } from '@/queries/index.js';
import { StoreFindOptions, StoreList } from '@/store/index.js';
import { toEntityList } from './entity.js';

const DEFAULT_QUERY_LIMIT = 1000;

export const convertLimitQuery = (
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
    // eslint-disable-next-line no-console
    console.warn(`Warning: Too many documents found without an explicit limit. A default limit of ${DEFAULT_QUERY_LIMIT} 
    was applied. Consider adding a limit to your query.`);

    // eslint-disable-next-line no-console
    console.trace(`Your query can be found here:`);
  }

  return toEntityList(metadata, list);
};
