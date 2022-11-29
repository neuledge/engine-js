import { StateDefinition } from '@/definitions/index.js';
import { MetadataCollection } from '@/metadata/collection.js';
import { RetriveQueryOptions } from '@/queries/index.js';
import { StoreFindOptions } from '@/store/index.js';
import { convertSelectQuery } from './select.js';

export const convertRetriveQuery = <S extends StateDefinition>(
  collection: MetadataCollection,
  { select, requireOne, includeOne, includeMany }: RetriveQueryOptions<S>,
): Pick<
  StoreFindOptions,
  'select' | 'includeMany' | 'includeFirst' | 'requireFirst'
> => ({
  ...(select != null
    ? { select: convertSelectQuery(collection, select) }
    : null),
});
