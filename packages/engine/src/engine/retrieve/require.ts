import { StoreFindOptions } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Metadata, MetadataCollection } from '@/metadata';
import { RequireQueryOptions } from '@/queries';
import { NeuledgeError } from '@/error';

export const convertRequireQuery = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  { requireOne }: RequireQueryOptions<S>,
): Pick<StoreFindOptions, 'requireFirst'> => {
  if (!requireOne) return {};

  // FIXME implement require query

  throw new NeuledgeError(
    NeuledgeError.Code.NOT_IMPLEMENTED,
    `Using include is not supported yet`,
  );
};
