import { StateDefinition } from '@/definitions/index.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { StoreFindOptions } from '@/store/index.js';
import { FilterQueryOptions } from '@/queries/index.js';
import { convertMatch } from './match.js';
import { convertWhere } from './where/index.js';

export const convertFilterQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match, where }: FilterQueryOptions<S>,
): Pick<StoreFindOptions, 'match' | 'where'> => ({
  ...(where != null ? { where: convertWhere(collection, where) } : null),
  ...(match != null
    ? { match: convertMatch(metadata, collection, match) }
    : null),
});
