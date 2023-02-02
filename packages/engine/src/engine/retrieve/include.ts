import { StoreFindOptions } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { IncludeQueryOptions } from '@/queries';
import { NeuledgeError } from '@/error';

export const convertIncludeQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { includeMany, includeOne }: IncludeQueryOptions<S>,
): Pick<StoreFindOptions, 'includeFirst' | 'includeMany'> => {
  if (!includeMany && !includeOne) return {};

  // FIXME implement include query

  throw new NeuledgeError(
    NeuledgeError.Code.NOT_IMPLEMENTED,
    `Using include is not supported yet`,
  );
};
