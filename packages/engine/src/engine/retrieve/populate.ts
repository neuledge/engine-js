import { StoreFindOptions } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { PopulateQueryOptions } from '@/queries';
import { NeuledgeError } from '@/error';

export const convertPopulateQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { populateMany, populateOne }: PopulateQueryOptions<S>,
): Pick<StoreFindOptions, 'requireFirst'> => {
  if (!populateMany && !populateOne) return {};

  // FIXME implement populate query

  throw new NeuledgeError(
    NeuledgeError.Code.NOT_IMPLEMENTED,
    `Using populate is not supported yet`,
  );
};
