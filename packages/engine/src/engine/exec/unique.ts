import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { UniqueQueryOptions } from '@/queries';
import { StoreFindOptions } from '@/store';
import { convertUniqueWhere } from './where/unique';

export const convertUniqueQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { unique }: UniqueQueryOptions<S>,
): Pick<StoreFindOptions, 'where'> => ({
  where: convertUniqueWhere(collection, unique),
});
