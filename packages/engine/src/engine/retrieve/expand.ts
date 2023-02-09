import { StoreFindOptions } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { NeuledgeError } from '@/error';
import { ExpandQueryOptions } from '@/queries';

export const convertExpandQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { expand }: ExpandQueryOptions<S>,
): Pick<StoreFindOptions, 'includeFirst' | 'includeMany'> => {
  if (!expand) return {};

  // FIXME implement expand query

  throw new NeuledgeError(
    NeuledgeError.Code.NOT_IMPLEMENTED,
    `Using expand is not supported yet`,
  );
};
