import { StoreFindOptions, StoreJoin } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { ExpandQueryOptions } from '@/queries';
import { convertRelationQueryOptions } from './relation';
import { convertFilterQuery } from '../find';
import { convertJoinSelectQuery } from '../select';
import { convertPopulateOneQuery } from './populate';

export const convertExpandQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { expand }: ExpandQueryOptions<S>,
): Pick<StoreFindOptions, 'innerJoin'> => ({
  ...(expand == null
    ? null
    : { innerJoin: convertExpand(metadata, collection, expand) }),
});

const convertExpand = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  expand: NonNullable<ExpandQueryOptions<S>['expand']>,
): StoreJoin =>
  convertRelationQueryOptions(
    metadata,
    collection,
    expand,
    ({ collection, by, query }) => ({
      collection,
      by,
      ...convertJoinSelectQuery(collection, query),
      ...convertFilterQuery(collection.states, collection, query),
      ...convertExpandQuery(metadata, collection, query),
      ...convertPopulateOneQuery(metadata, collection, query),
    }),
  );
