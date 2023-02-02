import { LimitQueryOptions } from '@/queries';
import { StoreFindOptions, StoreList } from '@neuledge/store';

export const DEFAULT_QUERY_LIMIT = 1000;

export const convertLimitQuery = (
  options: LimitQueryOptions,
): Pick<StoreFindOptions, 'limit'> => ({
  limit: options.limit ?? DEFAULT_QUERY_LIMIT,
});

export const checkLimitedList = (
  options: LimitQueryOptions,
  list: StoreList,
): StoreList => {
  if (
    options.limit == null &&
    list.length >= DEFAULT_QUERY_LIMIT &&
    typeof process === 'object' &&
    process?.env?.NODE_ENV !== 'production'
  ) {
    /* eslint-disable no-console */

    console.warn(`Warning: Too many documents found without an explicit limit. A default limit of ${DEFAULT_QUERY_LIMIT} 
    was applied. Consider adding a limit to your query.`);
    console.trace(`Your query can be found here:`);

    /* eslint-enable no-console */
  }

  return list;
};
