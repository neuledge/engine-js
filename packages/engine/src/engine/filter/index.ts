import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { StoreFindOptions } from '@/store';
import { FilterQueryOptions } from '@/queries';
import { convertMatch } from './match';
import { convertWhere } from './where';

export const convertFilterQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match, where }: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'match' | 'where'> => ({
  where: convertWhere(collection, where ?? null),

  ...(match != null
    ? { match: convertMatch(metadata, collection, match) }
    : null),
});
