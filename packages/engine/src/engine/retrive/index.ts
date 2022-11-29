import { StateDefinition } from '@/definitions/index.js';
import { MetadataCollection } from '@/metadata/collection.js';
import { RetriveQueryOptions } from '@/queries/index.js';
import { StoreFindOptions } from '@/store/index.js';
import { convertSelectQuery } from './select.js';

export const convertRetriveQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select }: RetriveQueryOptions<S>,
): Pick<StoreFindOptions, 'select'> => ({
  ...(select != null
    ? { select: convertSelectQuery(collection, select) }
    : null),
});
