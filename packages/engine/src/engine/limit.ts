import { StateDefinition } from '@/definitions';
import { Entity } from '@/entity';
import { EntityList } from '@/list';
import { Metadata, MetadataCollection } from '@/metadata';
import { LimitQueryOptions } from '@/queries';
import { StoreFindOptions, StoreList } from '@/store';
import { toEntityList } from './entity';

export const DEFAULT_QUERY_LIMIT = 1000;

export const convertLimitQuery = (
  options: LimitQueryOptions,
): Pick<StoreFindOptions, 'limit'> => ({
  limit: options.limit ?? DEFAULT_QUERY_LIMIT,
});

export const toLimitedEntityList = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  options: LimitQueryOptions,
  list: StoreList,
): EntityList<Entity<S>> => {
  if (options.limit == null && list.length >= DEFAULT_QUERY_LIMIT) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Too many documents found without an explicit limit. A default limit of ${DEFAULT_QUERY_LIMIT} 
    was applied. Consider adding a limit to your query.`);

    // eslint-disable-next-line no-console
    console.trace(`Your query can be found here:`);
  }

  return toEntityList(metadata, collection, list);
};
