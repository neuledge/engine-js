import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection, MetadataState } from '@/metadata';
import { StoreFindOptions } from '@neuledge/store';
import { FilterQueryOptions } from '@/queries';
import { convertMatchQuery } from './match';
import { convertWhereQuery } from './find';

export const convertFilterQuery = <S extends StateDefinition>(
  metadata: Metadata,
  states: MetadataState[],
  collection: MetadataCollection,
  query: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'match' | 'where'> => ({
  ...convertWhereQuery(states, collection, query),
  ...convertMatchQuery(metadata, collection, query),
});
