import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { MatchQueryOptions } from '@/queries';
import { StoreDeleteOptions, StoreMatch } from '@neuledge/store';
import { convertWhereQuery } from '../find';
import { convertRelationQueryOptions } from './relation';

export const convertMatchQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { match }: MatchQueryOptions<S>,
): Pick<StoreDeleteOptions, 'innerJoin'> => ({
  ...(match != null
    ? { innerJoin: convertMatch(metadata, collection, match) }
    : null),
});

const convertMatch = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: NonNullable<MatchQueryOptions<S>['match']>,
): StoreMatch =>
  convertRelationQueryOptions(
    metadata,
    collection,
    match,
    ({ collection, by, query }) => ({
      collection,
      by,
      ...convertWhereQuery(collection.states, collection, query),
      ...convertMatchQuery(metadata, collection, query),
    }),
  );
