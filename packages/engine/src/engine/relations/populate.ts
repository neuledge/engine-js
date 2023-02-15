import { StoreFindOptions, StoreJoin } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { PopulateQueryOptions } from '@/queries';
import { convertRelationQueryOptions } from './relation';
import { convertSelectQuery } from '../select';
import { convertWhereQuery } from '../find';
import { convertExpandQuery } from './expand';

// FIXME handle populate many as well

export const convertPopulateOneQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { populateOne }: PopulateQueryOptions<S>,
): Pick<StoreFindOptions, 'leftJoin'> => ({
  ...(populateOne != null
    ? { leftJoin: convertPopulateOne(metadata, collection, populateOne) }
    : null),
});

const convertPopulateOne = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  populateOne: NonNullable<PopulateQueryOptions<S>['populateOne']>,
): StoreJoin =>
  convertRelationQueryOptions(
    metadata,
    collection,
    populateOne,
    ({ collection, by, query }) => ({
      collection,
      by,
      ...convertSelectQuery(collection, query),
      ...convertWhereQuery(collection.states, collection, query),
      ...convertExpandQuery(metadata, collection, query),
      ...convertPopulateOneQuery(metadata, collection, query),
    }),
  );
