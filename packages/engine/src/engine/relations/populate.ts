import { StoreFindOptions, StoreLeftJoin } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { PopulateQueryOptions } from '@/queries';
import { convertRelationQueryOptions } from './relation';
import { convertLeftJoinSelectQuery } from '../select';
import { convertFilterQuery } from '../find';
import { convertExpandQuery } from './expand';

export const convertPopulateOneQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { populateOne }: PopulateQueryOptions<S>,
): Pick<StoreFindOptions, 'leftJoin'> => ({
  ...(populateOne == null
    ? null
    : { leftJoin: convertPopulateOne(metadata, collection, populateOne) }),
});

const convertPopulateOne = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  populateOne: NonNullable<PopulateQueryOptions<S>['populateOne']>,
): StoreLeftJoin =>
  convertRelationQueryOptions(
    metadata,
    collection,
    populateOne,
    ({ collection, by, query }) => ({
      collection,
      by,
      ...convertLeftJoinSelectQuery(collection, query),
      ...convertFilterQuery(collection.states, collection, query),
      ...convertExpandQuery(metadata, collection, query),
      ...convertPopulateOneQuery(metadata, collection, query),
    }),
  );
