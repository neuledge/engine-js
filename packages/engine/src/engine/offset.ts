import { OffsetQueryOptions } from '@/queries';
import { StoreFindOptions } from '@/store';

export const convertOffsetQuery = ({
  offset,
}: OffsetQueryOptions): Pick<StoreFindOptions, 'offset'> =>
  offset != null ? { offset } : {};
