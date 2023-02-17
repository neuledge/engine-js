import { StoreFindOptions, StoreJoin } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { ExpandQueryOptions } from '@/queries';
import { convertRelationQueryOptions } from './relation';
import { convertWhereQuery } from '../find';
import { convertJoinSelectQuery } from '../select';
import { convertPopulateOneQuery } from './populate';

export const convertExpandQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { expand }: ExpandQueryOptions<S>,
): Pick<StoreFindOptions, 'innerJoin'> => ({
  ...(expand != null
    ? { innerJoin: convertExpand(metadata, collection, expand) }
    : null),
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
      ...convertWhereQuery(collection.states, collection, query),
      ...convertExpandQuery(metadata, collection, query),
      ...convertPopulateOneQuery(metadata, collection, query),
    }),
  );
