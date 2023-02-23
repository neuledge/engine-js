import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { MatchQueryOptions } from '@/queries';
import { StoreFindOptions, StoreJoin } from '@neuledge/store';
import { convertFilterQuery } from '../find';
import { convertRelationQueryOptions } from './relation';

export const convertMatchQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match }: MatchQueryOptions<S>,
): Pick<StoreFindOptions, 'innerJoin'> => ({
  ...(match == null
    ? null
    : { innerJoin: convertMatch(metadata, collection, match) }),
});

const convertMatch = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: NonNullable<MatchQueryOptions<S>['match']>,
): StoreJoin =>
  convertRelationQueryOptions(
    metadata,
    collection,
    match,
    ({ collection, by, query }) => ({
      collection,
      by,
      ...convertFilterQuery(collection.states, collection, query),
      ...convertMatchQuery(metadata, collection, query),
    }),
  );
