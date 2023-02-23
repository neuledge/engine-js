import { OffsetQueryOptions } from '@/queries';
import { StoreFindOptions } from '@neuledge/store';

export const convertOffsetQuery = ({
  offset,
}: OffsetQueryOptions): Pick<StoreFindOptions, 'offset'> =>
  offset == null ? {} : { offset };
