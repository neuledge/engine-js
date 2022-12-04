import { StateDefinition } from '@/definitions';
import { MetadataCollection } from '@/metadata/collection';
import { RetriveQueryOptions } from '@/queries';
import { StoreFindOptions } from '@/store';
import { convertSelectQuery } from './select';

export const convertRetriveQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select }: RetriveQueryOptions<S>,
): Pick<StoreFindOptions, 'select'> => ({
  ...(select != null
    ? { select: convertSelectQuery(collection, select) }
    : null),
});
